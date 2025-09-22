import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stripe = getStripe();
    const products = await stripe.products.list({ limit: 100 });
    return NextResponse.json(products.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
