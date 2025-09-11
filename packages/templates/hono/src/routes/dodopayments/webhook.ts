import { Hono } from "hono";
import { Webhook } from "standardwebhooks";
import { getDodoPaymentsClient } from '../../lib/dodopayments';

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);

const router = new Hono()
  .post('/', async (c) => {
    try {
      const rawBody = await c.req.raw.text();
      const webhookHeaders = {
        "webhook-id": c.req.header("webhook-id") || "",
        "webhook-signature": c.req.header("webhook-signature") || "",
        "webhook-timestamp": c.req.header("webhook-timestamp") || "",
      };

      await webhook.verify(rawBody, webhookHeaders);
      const payload = JSON.parse(rawBody);
      if (payload.data.payload_type === "Subscription") {
        switch (payload.type) {
          case "subscription.active":
            const subscription = await getDodoPaymentsClient().subscriptions.retrieve(payload.data.subscription_id);
            console.log("-------SUBSCRIPTION DATA START ---------")
            console.log(subscription)
            console.log("-------SUBSCRIPTION DATA END ---------")
            break;
          case "subscription.failed":
            break;
          case "subscription.cancelled":
            break;
          case "subscription.renewed":
            break;
          case "subscription.on_hold":
            break
          default:
            break;
        }
      } else if (payload.data.payload_type === "Payment") {
        switch (payload.type) {
          case "payment.succeeded":
            const paymentDataResp = await getDodoPaymentsClient().payments.retrieve(payload.data.payment_id)
            console.log("-------PAYMENT DATA START ---------")
            console.log(paymentDataResp)
            console.log("-------PAYMENT DATA END ---------")
            break;
          default:
            break;
        }
      }

      return c.json({ message: "Webhook processed successfully" }, 200);
    } catch (error) {
      console.error('Error processing webhook:', error);
      return c.json({ error: 'Webhook verification failed:' }, 400);
    }
  })

export { router as webhookRouter };
