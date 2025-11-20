import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { getStripe } from "../../lib/stripe";
import { z } from "zod";
import type Stripe from "stripe";

const customerCreateSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
});

const customerUpdateSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(1, "Name is required").optional(),
  phone_number: z.string().optional().nullable(),
});

type CustomerCreateRequest = z.infer<typeof customerCreateSchema>;
type CustomerUpdateRequest = z.infer<typeof customerUpdateSchema>;

@Controller("customer")
export class CustomerController {
  private stripe = getStripe();

  @Get()
  async getCustomer(@Query("customer_id") customer_id?: string): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const customer = await this.stripe.customers.retrieve(customer_id);
      return customer;
    } catch (error) {
      console.error("Error fetching customer:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createCustomer(@Body() body: CustomerCreateRequest): Promise<any> {
    try {
      const validationResult = customerCreateSchema.safeParse(body);
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

      const customer = await this.stripe.customers.create({
        email: validationResult.data.email,
        name: validationResult.data.name,
        phone: validationResult.data.phone_number ?? "",
      });

      return customer;
    } catch (error) {
      console.error("Error creating customer:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  async updateCustomer(
    @Query("customer_id") customer_id: string,
    @Body() body: CustomerUpdateRequest,
  ): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const validationResult = customerUpdateSchema.safeParse(body);
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

      const updateData: Stripe.CustomerUpdateParams = {};
      if (validationResult.data.email)
        updateData.email = validationResult.data.email;
      if (validationResult.data.name)
        updateData.name = validationResult.data.name;
      if (validationResult.data.phone_number)
        updateData.phone = validationResult.data.phone_number;

      const customer = await this.stripe.customers.update(
        customer_id,
        updateData,
      );
      return customer;
    } catch (error) {
      console.error("Error updating customer:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("subscriptions")
  async getCustomerSubscriptions(
    @Query("customer_id") customer_id?: string,
    @Query("limit") limit?: string,
    @Query("starting_after") starting_after?: string,
  ): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse and validate limit
      const limitNum = limit ? parseInt(limit, 10) : 100;
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new HttpException(
          "limit must be a number between 1 and 100",
          HttpStatus.BAD_REQUEST,
        );
      }

      const subscriptions = await this.stripe.subscriptions.list({
        customer: customer_id,
        limit: limitNum,
        starting_after: starting_after,
      });

      return {
        data: subscriptions.data,
        has_more: subscriptions.has_more,
        ...(subscriptions.data.length > 0 && {
          last_id: subscriptions.data[subscriptions.data.length - 1].id,
        }),
      };
    } catch (error) {
      console.error("Error fetching customer subscriptions:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("payments")
  async getCustomerPayments(
    @Query("customer_id") customer_id?: string,
    @Query("limit") limit?: string,
    @Query("starting_after") starting_after?: string,
  ): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse and validate limit
      const limitNum = limit ? parseInt(limit, 10) : 100;
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new HttpException(
          "limit must be a number between 1 and 100",
          HttpStatus.BAD_REQUEST,
        );
      }

      const paymentIntents = await this.stripe.paymentIntents.list({
        customer: customer_id,
        limit: limitNum,
        starting_after: starting_after,
      });

      return {
        data: paymentIntents.data,
        has_more: paymentIntents.has_more,
        ...(paymentIntents.data.length > 0 && {
          last_id: paymentIntents.data[paymentIntents.data.length - 1].id,
        }),
      };
    } catch (error) {
      console.error("Error fetching customer payments:", error);
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
