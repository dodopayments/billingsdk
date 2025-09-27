
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const stripe = getStripe();

const productIdSchema = z.object({
    product_id: z.string().min(1, "Product ID is required"),
});

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const queryParams = {
            product_id: url.searchParams.get('product_id'),
        };
        const validationResult = productIdSchema.safeParse(queryParams);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { product_id } = validationResult.data;

        const product = await stripe.products.retrieve(product_id);
        return NextResponse.json(product);
    } catch (error) {
        if (error instanceof stripe.errors.StripeError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Error retrieving product:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve product' },
            { status: 500 }
        );
    }
}