import { getDodoPaymentsClient } from "@/lib/dodopayments";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await getDodoPaymentsClient().products.list();
        return NextResponse.json(products.items);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}