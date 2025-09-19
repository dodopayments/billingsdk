import { NextResponse } from "next/server";

// Minimal webhook receiver for PayPal events. Typically you'd verify the
// transmission using PayPal's verification API. Here we log and acknowledge.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    // In a real implementation, verify the transmission and signature headers here.
    console.log("[paypal webhook] event:", body);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[paypal webhook] error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
