import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { getStripe } from "../../lib/stripe";
import type Stripe from "stripe";

@Controller("subscriptions")
export class SubscriptionsController {
  private stripe = getStripe();

  @Get()
  async getSubscription(
    @Query("subscription_id") subscription_id?: string,
  ): Promise<any> {
    try {
      if (!subscription_id) {
        throw new HttpException(
          "subscription_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const subscription =
        await this.stripe.subscriptions.retrieve(subscription_id);
      return subscription;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: "Internal server error", details: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("list")
  async getSubscriptionsList(
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

      const params: Stripe.SubscriptionListParams = {
        customer: customer_id,
      };

      if (limit) {
        const parsed = parseInt(limit, 10);
        if (!isNaN(parsed)) params.limit = parsed;
      }

      if (starting_after) {
        params.starting_after = starting_after;
      }

      const subscriptions = await this.stripe.subscriptions.list(params);
      return subscriptions.data; // return only the subscriptions array
    } catch (error) {
      console.error("Error fetching subscriptions list:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: "Internal server error", details: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
