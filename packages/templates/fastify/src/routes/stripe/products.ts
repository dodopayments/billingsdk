// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getStripe } from "../../lib/stripe";

export default async function productsRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  fastify.get("/", async (request, reply) => {
    try {
      const { limit, starting_after } = request.query as Record<string, any>;

      const params: any = {};
      if (limit && typeof limit === "string") {
        const parsed = parseInt(limit, 10);
        if (!isNaN(parsed)) params.limit = parsed;
      }

      if (starting_after && typeof starting_after === "string") {
        params.starting_after = starting_after;
      }

      const products = await stripe.products.list(params);
      return reply.send(products.data);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching products");
      return reply.status(500).send({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  });

  fastify.get("/product", async (request, reply) => {
    try {
      const { product_id } = request.query as Record<string, any>;
      if (!product_id || typeof product_id !== "string") {
        return reply.status(400).send({ error: "product_id is required" });
      }
      const product = await stripe.products.retrieve(product_id);
      return reply.send(product);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching product");
      return reply.status(500).send({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  });
}
