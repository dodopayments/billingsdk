import { getDodoPaymentsClient } from "@/lib/dodopayments";
import { NextResponse } from "next/server";
import { z } from "zod";

const subscriptionQuerySchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
});

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

        const subscriptions = await getDodoPaymentsClient().subscriptions.list({
            customer_id: validationResult.data.customer_id,
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
}