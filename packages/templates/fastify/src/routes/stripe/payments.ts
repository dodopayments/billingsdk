// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getStripe } from "../../lib/stripe";

export default async function paymentsRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  fastify.get("/", async (request, reply) => {
    try {
      const { payment_id } = request.query as Record<string, any>;
      if (!payment_id || typeof payment_id !== "string") {
        return reply.status(400).send({ error: "payment_id is required" });
      }
      const payment = await stripe.paymentIntents.retrieve(payment_id);
      return reply.send(payment);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching payment");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/list", async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<
        string,
        any
      >;

      const params: any = {};
      if (customer_id && typeof customer_id === "string") {
        params.customer = customer_id;
      }
      if (limit && typeof limit === "string") {
        params.limit = parseInt(limit);
      }
      if (starting_after && typeof starting_after === "string") {
        params.starting_after = starting_after;
      }

      const payments = await stripe.paymentIntents.list(params);
      return reply.send(payments);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching payments list");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
