import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { getStripe } from '../../lib/stripe';
import type Stripe from 'stripe';

@Controller('products')
export class ProductsController {
  private stripe = getStripe();

  @Get()
  async getProducts(
    @Query('limit') limit?: string,
    @Query('starting_after') starting_after?: string,
  ): Promise<any> {
    try {
      const params: Stripe.ProductListParams = {};
      if (limit) {
        const parsed = parseInt(limit, 10);
        if (!isNaN(parsed)) params.limit = parsed;
      }

      if (starting_after) {
        params.starting_after = starting_after;
      }

      const products = await this.stripe.products.list(params);
      return products.data; // this returns only product array
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException(
        { error: 'Internal server error', details: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('product')
  async getProduct(@Query('product_id') product_id?: string): Promise<any> {
    try {
      if (!product_id) {
        throw new HttpException('product_id is required', HttpStatus.BAD_REQUEST);
      }

      const product = await this.stripe.products.retrieve(product_id);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: 'Internal server error', details: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
