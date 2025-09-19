// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getStripe } from "../../lib/stripe";

export default async function webhookRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  fastify.post("/", async (request, reply) => {
    try {
      const sig = request.headers["stripe-signature"] as string | undefined;
      if (!sig) {
        return reply.status(400).send({ error: "Missing Stripe signature" });
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return reply
          .status(500)
          .send({ error: "Webhook secret not configured" });
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          request.rawBody,
          sig,
          webhookSecret
        );
      } catch (err) {
        request.log.error({ err }, "Webhook signature verification failed");
        return reply.status(400).send({ error: "Webhook verification failed" });
      }

      try {
        switch (event.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object;
            request.log.info(
              { subscriptionId: subscription.id },
              `Subscription event: ${event.type}`
            );
            break;
          }

          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            request.log.info(
              {
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
              },
              "Payment succeeded"
            );
            break;
          }

          case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            request.log.info(
              {
                paymentIntentId: paymentIntent.id,
                lastPaymentError: paymentIntent.last_payment_error,
              },
              "Payment failed"
            );
            break;
          }

          case "charge.refunded": {
            const charge = event.data.object;
            request.log.info(
              {
                chargeId: charge.id,
                amountRefunded: charge.amount_refunded,
              },
              "Charge refunded"
            );
            break;
          }

          default:
            request.log.info({ eventType: event.type }, "Unhandled event type");
            break;
        }

        return reply
          .status(200)
          .send({ message: "Webhook processed successfully" });
      } catch (err) {
        request.log.error({ err }, "Error handling webhook event");
        return reply.status(500).send({ error: "Internal server error" });
      }
    } catch (error) {
      request.log.error({ err: error }, "Error handling webhook");
      return reply.status(400).send({ error: "Webhook Error" });
    }
  });
}
