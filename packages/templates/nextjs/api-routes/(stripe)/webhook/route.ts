import { NextResponse } from "next/server";
import { getStripe } from "../../../lib/stripe";
import type Stripe from "stripe";

const stripe = getStripe();


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const sig = request.headers.get("stripe-signature");
    
    if (!sig) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const rawBody = await request.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 }
      );
    }

    
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("-------SUBSCRIPTION EVENT START ---------");
        console.log(`Event: ${event.type}, Subscription ID: ${subscription.id}`);
        console.log(subscription);
        console.log("-------SUBSCRIPTION EVENT END ---------");
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("-------PAYMENT SUCCEEDED START ---------");
        console.log(`Payment Intent ID: ${paymentIntent.id}, Amount: ${paymentIntent.amount}`);
        console.log(paymentIntent);
        console.log("-------PAYMENT SUCCEEDED END ---------");
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("-------PAYMENT FAILED START ---------");
        console.log(`Payment Intent ID: ${paymentIntent.id}`);
        console.log(paymentIntent.last_payment_error);
        console.log("-------PAYMENT FAILED END ---------");
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("-------CHARGE REFUNDED START ---------");
        console.log(`Charge ID: ${charge.id}, Amount refunded: ${charge.amount_refunded}`);
        console.log(charge);
        console.log("-------CHARGE REFUNDED END ---------");
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
