import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { Webhook } from "standardwebhooks";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

@Controller("webhook")
export class WebhookController {
  private webhook: Webhook;

  constructor() {
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    if (!webhookKey) {
      throw new Error(
        "DODO_PAYMENTS_WEBHOOK_KEY is required for DodoPayments webhook",
      );
    }
    this.webhook = new Webhook(webhookKey);
  }

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<any> {
    // Get raw body for signature verification
    const rawBody: Buffer | string = (req as any).rawBody || req.body;

    const webhookHeaders = {
      "webhook-id": (req.headers["webhook-id"] as string) || "",
      "webhook-signature": (req.headers["webhook-signature"] as string) || "",
      "webhook-timestamp": (req.headers["webhook-timestamp"] as string) || "",
    };

    // Verify webhook signature first
    try {
      await this.webhook.verify(rawBody, webhookHeaders);
    } catch (error) {
      console.error("Webhook verification failed:", error);
      res.status(400).json({ error: "Webhook verification failed" });
      return;
    }

    // Parse payload after successful verification
    let payload: any;
    try {
      payload = JSON.parse(
        typeof rawBody === "string" ? rawBody : rawBody.toString(),
      );
    } catch (error) {
      console.error("Failed to parse webhook payload:", error);
      res.status(400).json({ error: "Invalid webhook payload" });
      return;
    }

    // Process the webhook payload
    try {
      if (payload.data.payload_type === "Subscription") {
        switch (payload.type) {
          case "subscription.active": {
            const subscription =
              await getDodoPaymentsClient().subscriptions.retrieve(
                payload.data.subscription_id,
              );
            console.log("-------SUBSCRIPTION DATA START ---------");
            console.log(subscription);
            console.log("-------SUBSCRIPTION DATA END ---------");
            break;
          }
          case "subscription.failed":
            console.log("Subscription failed:", payload.data.subscription_id);
            break;
          case "subscription.cancelled":
            console.log(
              "Subscription cancelled:",
              payload.data.subscription_id,
            );
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
          case "payment.succeeded": {
            const paymentDataResp =
              await getDodoPaymentsClient().payments.retrieve(
                payload.data.payment_id,
              );
            console.log("-------PAYMENT DATA START ---------");
            console.log(paymentDataResp);
            console.log("-------PAYMENT DATA END ---------");
            break;
          }
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
      console.error("Webhook processing failed:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
}
