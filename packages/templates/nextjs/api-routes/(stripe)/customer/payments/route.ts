import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";


const stripe = getStripe();

const paymentQuerySchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customer_id = url.searchParams.get("customer_id");

    const validationResult = paymentQuerySchema.safeParse({ customer_id });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const validatedParams = validationResult.data;

    
    const paymentIntents = await stripe.paymentIntents.list({
      customer: validatedParams.customer_id,
      limit: 10
    });

    return NextResponse.json(paymentIntents.data);
  } catch (error) {
    console.error("Error fetching customer payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer payments" },
      { status: 500 }
    );
  }
}
