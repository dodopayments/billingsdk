import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = await headers();
  const stripe = getStripe();

  try {
    const body = await request.text();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 }
      );
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
            paymentIntent.amount
          );
          break;
        }

        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(
            "Payment failed:",
            paymentIntent.id,
            paymentIntent.last_payment_error
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

      return NextResponse.json(
        { message: "Webhook processed successfully" },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error handling webhook event:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(" ----- webhook verification failed -----");
    console.log(error);
    return NextResponse.json(
      { message: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
