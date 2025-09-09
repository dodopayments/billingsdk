
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const subscriptionQuerySchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
});

const stripe = getStripe();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const customer_id = url.searchParams.get('customer_id');

        const validationResult = subscriptionQuerySchema.safeParse({ customer_id });

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: validationResult.data.customer_id,
            status: 'all',
            expand: ["data.default_payment_method"]
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
}