import { Router } from "express";
import type { Request, Response } from "express";
import { Webhook } from "standardwebhooks";
import express from "express"
import { getDodoPaymentsClient } from "../../lib/dodopayments";

const router = Router();
const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);

// NOTE: we need raw body for signature verification
// so disable JSON parsing for this route
router.post("/", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  try {
    const rawBody = req.body.toString(); // since it's raw buffer
    const webhookHeaders = {
      "webhook-id": req.header("webhook-id") || "",
      "webhook-signature": req.header("webhook-signature") || "",
      "webhook-timestamp": req.header("webhook-timestamp") || "",
    };

    
    await webhook.verify(rawBody, webhookHeaders);

    const payload = JSON.parse(rawBody);

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await getDodoPaymentsClient().subscriptions.retrieve(
            payload.data.subscription_id
          );
          console.log("-------SUBSCRIPTION DATA START ---------");
          console.log(subscription);
          console.log("-------SUBSCRIPTION DATA END ---------");
          break;
        case "subscription.failed":
          // handle failed subscription
          break;
        // etc...
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payload.type) {
        case "payment.succeeded":
          const payment = await getDodoPaymentsClient().payments.retrieve(
            payload.data.payment_id
          );
          console.log("-------PAYMENT DATA START ---------");
          console.log(payment);
          console.log("-------PAYMENT DATA END ---------");
          break;
      }
    }

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return res.status(400).json({ error: "Invalid webhook" });
  }
});

export default router;
