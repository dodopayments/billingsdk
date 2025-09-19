import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";

const stripe = getStripe();

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("Subscription event:", subscription.id, event.type);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Checkout completed:", session.id);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling event:", error);
    return Response.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
