import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

@Controller("products")
export class ProductsController {
  @Get()
  async getProducts(
    @Query("limit") limit?: string,
    @Query("starting_after") starting_after?: string,
  ): Promise<any> {
    try {
      const params: any = {};
      if (limit) {
        params.limit = parseInt(limit);
      }
      if (starting_after) {
        params.starting_after = starting_after;
      }

      const products = await getDodoPaymentsClient().products.list(params);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("product")
  async getProduct(@Query("product_id") product_id?: string): Promise<any> {
    try {
      if (!product_id) {
        throw new HttpException(
          "product_id is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const product =
        await getDodoPaymentsClient().products.retrieve(product_id);
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
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
