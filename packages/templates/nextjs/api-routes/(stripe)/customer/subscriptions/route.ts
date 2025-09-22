import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const subscriptionQuerySchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customer_id = url.searchParams.get("customer_id");

    const validationResult = subscriptionQuerySchema.safeParse({ customer_id });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: validationResult.data.customer_id,
      limit: 100,
    });

    return NextResponse.json(subscriptions.data);
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer subscriptions" },
      { status: 500 }
    );
  }
}
