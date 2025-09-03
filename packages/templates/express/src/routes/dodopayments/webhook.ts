import { Router, Request, Response, NextFunction } from "express";
import { Webhook } from "standardwebhooks";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

export const router = Router();

// Use raw body for webhook verification on this route only
router.post(
  "/",
  // @ts-ignore - express typing for raw is compatible at runtime
  require("express").raw({ type: "application/json" }),
  async (req: Request, res: Response, _next: NextFunction) => {
    const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);
    try {
      const rawBody = req.body instanceof Buffer ? req.body.toString("utf8") : "";
      const headers = req.headers;
      const webhookHeaders = {
        "webhook-id": (headers["webhook-id"] as string) || "",
        "webhook-signature": (headers["webhook-signature"] as string) || "",
        "webhook-timestamp": (headers["webhook-timestamp"] as string) || "",
      };

      await webhook.verify(rawBody, webhookHeaders);
      const payload = JSON.parse(rawBody);

      if (payload.data.payload_type === "Subscription") {
        switch (payload.type) {
          case "subscription.active": {
            const subscription = await getDodoPaymentsClient().subscriptions.retrieve(
              payload.data.subscription_id
            );
            console.log("-------SUBSCRIPTION DATA START ---------");
            console.log(subscription);
            console.log("-------SUBSCRIPTION DATA END ---------");
            break;
          }
          case "subscription.failed":
          case "subscription.cancelled":
          case "subscription.renewed":
          case "subscription.on_hold":
          default:
            break;
        }
      } else if (payload.data.payload_type === "Payment") {
        switch (payload.type) {
          case "payment.succeeded": {
            const paymentDataResp = await getDodoPaymentsClient().payments.retrieve(
              payload.data.payment_id
            );
            console.log("-------PAYMENT DATA START ---------");
            console.log(paymentDataResp);
            console.log("-------PAYMENT DATA END ---------");
            break;
          }
          default:
            break;
        }
      }

      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.log(" ----- webhook verification failed -----");
      console.log(error);
      res.status(200).json({ message: "Webhook processed successfully" });
    }
  }
);

