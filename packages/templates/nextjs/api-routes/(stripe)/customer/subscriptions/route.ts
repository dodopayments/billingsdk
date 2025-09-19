import { z } from "zod";
import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";

const subscriptionQuerySchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
})

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const customer_id = url.searchParams.get('customer_id');

        const validatedResult = subscriptionQuerySchema.safeParse({customer_id});
        if(!validatedResult.success) {
            return NextResponse.json(
                {error: validatedResult.error.issues[0].message}, { status: 400 })
        }
        const subscriptions = await getStripe().subscriptions.list({
            customer: validatedResult.data.customer_id,
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error("Error while fetching subsciption:", error);
        return NextResponse.json({
            error: 'Failed to fetch subscription'
        }, { status: 500 })
    }
}