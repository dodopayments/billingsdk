import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { getDodoPaymentsClient } from '../../lib/dodopayments';
import { z } from 'zod';

const productCartItemSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  amount: z.number().int().min(0).optional(),
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

const customerSchema = z.union([attachExistingCustomerSchema, newCustomerSchema]);

const billingAddressSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().regex(/^[A-Z]{2}$/, "Country must be a 2-letter uppercase ISO code"),
  state: z.string().min(1, "State is required"),
  street: z.string().min(1, "Street address is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
});

const checkoutSessionSchema = z.object({
  productCart: z.array(productCartItemSchema).min(1, "At least one product is required"),
  customer: customerSchema,
  billing_address: billingAddressSchema,
  return_url: z.string().url("Return URL must be a valid URL"),
  customMetadata: z.record(z.string(), z.string()).optional(),
});

type CheckoutSessionRequest = z.infer<typeof checkoutSessionSchema>;

@Controller('checkout')
export class CheckoutController {
  @Post()
  async createCheckoutSession(@Body() body: CheckoutSessionRequest): Promise<any> {
    try {
      const validationResult = checkoutSessionSchema.safeParse(body);
      if (!validationResult.success) {
        throw new HttpException(
          {
            error: "Validation failed",
            details: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const { productCart, customer, billing_address, return_url, customMetadata } = validationResult.data;

      const session = await getDodoPaymentsClient().checkoutSessions.create({
        product_cart: productCart as any,
        customer: customer as any,
        billing_address: billing_address as any,
        return_url: return_url,
        metadata: customMetadata,
      });

      return session;
    } catch (error) {
      console.error('Error in checkout POST handler:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
