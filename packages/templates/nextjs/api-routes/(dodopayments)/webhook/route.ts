import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { getDodoPaymentsClient } from "@/lib/dodopayments";

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);

export async function POST(request: Request) {
  const headersList =  await headers();
  try {
    const rawBody = await request.text();
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await getDodoPaymentsClient().subscriptions.retrieve(payload.data.subscription_id);
          console.log("-------SUBSCRIPTION DATA START ---------")
          console.log(subscription)
          console.log("-------SUBSCRIPTION DATA END ---------")
          break;
        case "subscription.failed":
          break;
        case "subscription.cancelled":
          break;
        case "subscription.renewed":
          break;
        case "subscription.on_hold":
          break
        default:
          break;
      }
    } else if (payload.data.payload_type === "Payment") {
        switch (payload.type) {
            case "payment.succeeded":
              const paymentDataResp = await getDodoPaymentsClient().payments.retrieve(payload.data.payment_id)
              console.log("-------PAYMENT DATA START ---------")
              console.log(paymentDataResp)
              console.log("-------PAYMENT DATA END ---------")
              break;
            default:
                break;
        }
    }
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(" ----- webhook verification failed -----")
    console.log(error)
    return Response.json(
      { message: "Webhook verification failed" },
      { status: 400 }
    );
  }
}