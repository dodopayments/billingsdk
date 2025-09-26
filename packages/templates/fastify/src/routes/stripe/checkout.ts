// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getStripe } from "../../lib/stripe";

export default async function checkoutRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  fastify.post("/", async (request, reply) => {
    try {
      const { price_id, customer_id, success_url, cancel_url } =
        request.body as Record<string, any>;
      if (!price_id || !success_url || !cancel_url) {
        return reply
          .status(400)
          .send({ error: "price_id, success_url and cancel_url are required" });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: price_id, quantity: 1 }],
        customer: customer_id ?? undefined,
        success_url,
        cancel_url,
      });
      return reply.send({ checkout_url: session.url });
    } catch (error) {
      request.log.error({ err: error }, "Error creating checkout session");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
