import { Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

@Controller("webhook")
export class WebhookController {
  private stripe = getStripe();
  private webhookSecret: string;

  constructor() {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    }
    this.webhookSecret = webhookSecret;
  }

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<any> {
    // Get raw body for signature verification
    const rawBody: Buffer | string = (req as any).rawBody || req.body;

    const sig = req.headers["stripe-signature"] as string | undefined;
    if (!sig) {
      return res.status(400).json({ error: "Missing Stripe signature" });
    }

    const webhookSecret = this.webhookSecret;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    try {
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log("Subscription event:", event.type, subscription.id);
          break;
        }

        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(
            "Payment succeeded:",
            paymentIntent.id,
            paymentIntent.amount,
          );
          break;
        }

        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(
            "Payment failed:",
            paymentIntent.id,
            paymentIntent.last_payment_error,
          );
          break;
        }

        case "charge.refunded": {
          const charge = event.data.object as Stripe.Charge;
          console.log("Charge refunded:", charge.id, charge.amount_refunded);
          break;
        }

        default:
          console.log("Unhandled event type:", event.type);
          break;
      }

      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (err) {
      console.error("Error handling webhook event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
