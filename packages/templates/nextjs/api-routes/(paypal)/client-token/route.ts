import { NextResponse } from "next/server";

// Provides PayPal client configuration for the frontend.
// In many integrations, a client token can be generated via PayPal APIs,
// but for basic button SDK usage, exposing the client ID is sufficient.
export async function GET() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID || "";
    if (!clientId) {
      return NextResponse.json({ error: "PAYPAL_CLIENT_ID is not set" }, { status: 500 });
    }
    return NextResponse.json({ clientId });
  } catch (error) {
    console.error("[paypal client-token] error:", error);
    return NextResponse.json({ error: "Failed to get client token" }, { status: 500 });
  }
}
