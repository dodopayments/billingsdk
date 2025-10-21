import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { getStripe } from '../../lib/stripe';

@Controller('payments')
export class PaymentsController {
  private stripe = getStripe();

  @Get()
  async getPayment(@Query('payment_id') payment_id?: string): Promise<any> {
    try {
      if (!payment_id) {
        throw new HttpException('payment_id is required', HttpStatus.BAD_REQUEST);
      }

      const payment = await this.stripe.paymentIntents.retrieve(payment_id);
      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list')
  async getPaymentsList(
    @Query('customer_id') customer_id?: string,
    @Query('limit') limit?: string,
    @Query('starting_after') starting_after?: string,
  ): Promise<any> {
    try {
      const params: any = {};
      if (customer_id) {
        params.customer = customer_id;
      }
      if (limit) {
        params.limit = parseInt(limit, 10);
      }
      if (starting_after) {
        params.starting_after = starting_after;
      }

      const payments = await this.stripe.paymentIntents.list(params);
      return payments.data;
    } catch (error) {
      console.error('Error fetching payments list:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
