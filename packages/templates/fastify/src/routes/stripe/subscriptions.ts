// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getStripe } from "../../lib/stripe";

export default async function subscriptionsRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  fastify.get("/", async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>;
      if (!subscription_id || typeof subscription_id !== "string") {
        return reply.status(400).send({ error: "subscription_id is required" });
      }
      const subscription = await stripe.subscriptions.retrieve(subscription_id);
      return reply.send(subscription);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching subscription");
      return reply.status(500).send({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  });

  fastify.get("/list", async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<
        string,
        any
      >;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }

      const params: any = {
        customer: customer_id,
      };

      if (limit && typeof limit === "string") {
        const parsed = parseInt(limit, 10);
        if (!isNaN(parsed)) params.limit = parsed;
      }

      if (starting_after && typeof starting_after === "string") {
        params.starting_after = starting_after;
      }

      const subscriptions = await stripe.subscriptions.list(params);
      return reply.send(subscriptions.data);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching subscriptions list");
      return reply.status(500).send({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  });
}
