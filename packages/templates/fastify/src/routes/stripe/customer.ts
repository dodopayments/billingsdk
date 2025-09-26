// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getStripe } from "../../lib/stripe";

export default async function customerRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  fastify.get("/", async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }
      const customer = await stripe.customers.retrieve(customer_id);
      return reply.send(customer);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching customer");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const { email, name, phone_number } = request.body as Record<string, any>;
      const customer = await stripe.customers.create({
        email,
        name,
        phone: phone_number ?? "",
      });
      return reply.send(customer);
    } catch (error) {
      request.log.error({ err: error }, "Error creating customer");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.put("/", async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }
      const { email, name, phone_number } = request.body as Record<string, any>;
      const updateData: any = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (phone_number) updateData.phone = phone_number;
      const customer = await stripe.customers.update(customer_id, updateData);
      return reply.send(customer);
    } catch (error) {
      request.log.error({ err: error }, "Error updating customer");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/subscriptions", async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }
      const subs = await stripe.subscriptions.list({
        customer: customer_id,
        limit: 100,
      });
      return reply.send(subs.data);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching subscriptions");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/payments", async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }
      const intents = await stripe.paymentIntents.list({
        customer: customer_id,
        limit: 100,
      });
      return reply.send(intents.data);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching customer payments");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
