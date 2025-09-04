import express from 'express';
import { Webhook } from "standardwebhooks";
import { getDodoPaymentsClient } from '../../lib/dodopayments';

const router = express.Router();

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const rawBody = req.body;
        const webhookHeaders = {
            "webhook-id": req.headers["webhook-id"] as string || "",
            "webhook-signature": req.headers["webhook-signature"] as string || "",
            "webhook-timestamp": req.headers["webhook-timestamp"] as string || "",
        };

        await webhook.verify(rawBody, webhookHeaders);
        const payload = JSON.parse(rawBody.toString());

        if (payload.data.payload_type === "Subscription") {
            switch (payload.type) {
                case "subscription.active":
                    const subscription = await getDodoPaymentsClient().subscriptions.retrieve(payload.data.subscription_id);
                    console.log("-------SUBSCRIPTION DATA START ---------")
                    console.log(subscription)
                    console.log("-------SUBSCRIPTION DATA END ---------")
                    break;
                case "subscription.failed":
                    console.log("Subscription failed:", payload.data.subscription_id);
                    break;
                case "subscription.cancelled":
                    console.log("Subscription cancelled:", payload.data.subscription_id);
                    break;
                case "subscription.renewed":
                    console.log("Subscription renewed:", payload.data.subscription_id);
                    break;
                case "subscription.on_hold":
                    console.log("Subscription on hold:", payload.data.subscription_id);
                    break;
                default:
                    console.log("Unknown subscription event:", payload.type);
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
                case "payment.failed":
                    console.log("Payment failed:", payload.data.payment_id);
                    break;
                case "payment.refunded":
                    console.log("Payment refunded:", payload.data.payment_id);
                    break;
                default:
                    console.log("Unknown payment event:", payload.type);
                    break;
            }
        }

        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Webhook verification failed:", error);
        res.status(400).json({ error: "Webhook verification failed" });
    }
});

export { router as webhookRouter };
