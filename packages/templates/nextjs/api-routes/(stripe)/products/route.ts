import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const stripe = getStripe();

export async function GET() {
    try {
        const products = await stripe.products.list();
        return NextResponse.json(products);
    } catch (error) {
        if (error instanceof stripe.errors.StripeError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}