import { z } from "zod";
import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";


const paymentQuerySchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
})


export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const customer_id = url.searchParams.get('customer_id');

        const validatedResult = paymentQuerySchema.safeParse({customer_id});

        if(!validatedResult.success) {
            return NextResponse.json({
                error: validatedResult.error.issues[0].message
            }, { status: 400 })
        }
        const validatedParams = validatedResult.data

        const payments = await getStripe().paymentIntents.list({ customer: validatedParams.customer_id, limit: 100 });

        return NextResponse.json(payments)
    } catch (error) {
        console.error('Error fetching customer payments:', error);
        return NextResponse.json({ error: 'Failed to fetch customer payments' }, { status: 500 });
    }
}