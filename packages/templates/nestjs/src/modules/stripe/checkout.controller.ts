import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { z } from "zod";
import { getStripe } from "../../lib/stripe";
import type Stripe from "stripe";

const productCartItemSchema = z.object({
  price_id: z.string().min(1, "Price ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const attachExistingCustomerSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

const newCustomerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
  create_new_customer: z.boolean().optional(),
});

const customerSchema = z.union([
  attachExistingCustomerSchema,
  newCustomerSchema,
]);

const checkoutSessionSchema = z.object({
  productCart: z
    .array(productCartItemSchema)
    .min(1, "At least one product is required"),
  customer: customerSchema.optional(),
  success_url: z.string().url("Success URL must be a valid URL"),
  cancel_url: z.string().url("Cancel URL must be a valid URL"),
  metadata: z.record(z.string(), z.string()).optional(),
});

type CheckoutSessionRequest = z.infer<typeof checkoutSessionSchema>;

@Controller("checkout")
export class CheckoutController {
  private stripe = getStripe();

  @Post()
  async createCheckoutSession(
    @Body() body: CheckoutSessionRequest,
  ): Promise<any> {
    try {
      const validationResult = checkoutSessionSchema.safeParse(body);
      if (!validationResult.success) {
        throw new HttpException(
          {
            error: "Validation failed",
            details: validationResult.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const { productCart, customer, success_url, cancel_url, metadata } =
        validationResult.data;

      let customerId: string | undefined;
      if (customer && "email" in customer) {
        const stripeCustomer = await this.stripe.customers.create({
          email: customer.email ?? "",
          name: customer.name ?? "",
          phone: customer.phone_number ?? "",
        });
        customerId = stripeCustomer.id;
      } else if (customer && "customer_id" in customer) {
        customerId = customer.customer_id;
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: productCart.map((item) => ({
          price: item.price_id,
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: success_url + "?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: cancel_url,

        ...(metadata ? { metadata } : {}),
      };

      if (customerId) {
        sessionParams.customer = customerId;
      }

      const session = await this.stripe.checkout.sessions.create(sessionParams);

      return { url: session.url };
    } catch (error) {
      console.error("Stripe checkout error:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
