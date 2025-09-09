import { z } from "zod";
import {NextRequest, NextResponse} from "next/server";
import { getStripe } from "@/lib/stripe";


const productCartItemSchema = z.object({
    name: z.string().min(1),
    quantity: z.number().int().min(1),
    amount: z.number().int().min(1),
});

const stripe = getStripe();

const customerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1)
});

const checkoutSessionSchema = z.object({
    productCart: z.array(productCartItemSchema).min(1),
    customer: customerSchema,
    return_url: z.string().url,
    metadata: z.record(z.string(), z.string()).optional()

})


export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const validation = checkoutSessionSchema.safeParse(body);

        if(!validation.success) {
            return NextResponse.json({
                error: "Validation failed",
                details: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))

            }
            , {status: 400}
            )
        }

        const {productCart, customer, return_url, metadata} = validation.data;

        const session = await stripe?.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: productCart.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {name: item.name},
                    unit_amount: item.amount
                },
                quantity: item.quantity
            })),
            mode: "payment",
            customer_email: customer.email,
            success_url: `${return_url}?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${return_url}?status=cancelled`,
            metadata
        });
        return NextResponse.json({url: session.url})
    } catch (error) {
        console.error("Stripe checkout error: ", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})

    }

}   