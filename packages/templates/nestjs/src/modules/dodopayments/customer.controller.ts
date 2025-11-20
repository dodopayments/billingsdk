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
import { getDodoPaymentsClient } from "../../lib/dodopayments";
import { z } from "zod";

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
  @Get()
  async getCustomer(@Query("customer_id") customer_id?: string): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const customer =
        await getDodoPaymentsClient().customers.retrieve(customer_id);
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

      const customer = await getDodoPaymentsClient().customers.create({
        email: validationResult.data.email,
        name: validationResult.data.name,
        phone_number: validationResult.data.phone_number,
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

      const updateData: Partial<{
        email: string;
        name: string;
        phone_number: string | null;
      }> = {};
      if (validationResult.data.email !== undefined)
        updateData.email = validationResult.data.email;
      if (validationResult.data.name !== undefined)
        updateData.name = validationResult.data.name;
      if (validationResult.data.phone_number !== undefined)
        updateData.phone_number = validationResult.data.phone_number;

      const customer = await getDodoPaymentsClient().customers.update(
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
    @Query("starting_after") starting_after?: string,
    @Query("limit") limit?: string,
  ): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse and validate pagination parameters
      const limitNum = limit ? parseInt(limit, 10) : 20;

      if (isNaN(limitNum) || limitNum < 1) {
        throw new HttpException(
          "limit must be a positive integer",
          HttpStatus.BAD_REQUEST,
        );
      }

      if (limitNum > 100) {
        throw new HttpException(
          "limit cannot exceed 100",
          HttpStatus.BAD_REQUEST,
        );
      }

      const params: any = {
        customer_id: customer_id,
        limit: limitNum,
      };
      if (starting_after) {
        params.starting_after = starting_after;
      }

      const subscriptions =
        await getDodoPaymentsClient().subscriptions.list(params);
      return subscriptions;
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
    @Query("starting_after") starting_after?: string,
    @Query("limit") limit?: string,
  ): Promise<any> {
    try {
      if (!customer_id) {
        throw new HttpException(
          "customer_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse and validate pagination parameters
      const limitNum = limit ? parseInt(limit, 10) : 20;

      if (isNaN(limitNum) || limitNum < 1) {
        throw new HttpException(
          "limit must be a positive integer",
          HttpStatus.BAD_REQUEST,
        );
      }

      if (limitNum > 100) {
        throw new HttpException(
          "limit cannot exceed 100",
          HttpStatus.BAD_REQUEST,
        );
      }

      const params: any = {
        customer_id: customer_id,
        limit: limitNum,
      };
      if (starting_after) {
        params.starting_after = starting_after;
      }

      const payments = await getDodoPaymentsClient().payments.list(params);
      return payments;
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
