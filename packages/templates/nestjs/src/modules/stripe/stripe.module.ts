import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CustomerController } from './customer.controller';
import { CheckoutController } from './checkout.controller';
import { SubscriptionsController } from './subscriptions.controller';
import { PaymentsController } from './payments.controller';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [
    ProductsController,
    CustomerController,
    CheckoutController,
    SubscriptionsController,
    PaymentsController,
    WebhookController,
  ],
})
export class StripeModule {}
