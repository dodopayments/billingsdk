import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

@Controller("subscriptions")
export class SubscriptionsController {
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
        await getDodoPaymentsClient().subscriptions.retrieve(subscription_id);
      return subscription;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Internal server error",
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
      const params: any = {};
      if (customer_id) {
        params.customer_id = customer_id;
      }
      if (limit) {
        params.limit = parseInt(limit);
      }
      if (starting_after) {
        params.starting_after = starting_after;
      }

      const subscriptions =
        await getDodoPaymentsClient().subscriptions.list(params);
      return subscriptions;
    } catch (error) {
      console.error("Error fetching subscriptions list:", error);
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
