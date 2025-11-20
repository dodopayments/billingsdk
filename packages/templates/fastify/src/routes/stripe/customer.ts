import { FastifyInstance } from "fastify";
import { z } from "zod";
import type Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

export default async function customerRoutes(fastify: FastifyInstance) {
  const stripe = getStripe();

  const customerCreateSchema = z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional().nullable(),
    metadata: z.record(z.string(), z.string()).optional(),
  });

  const customerUpdateSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    name: z.string().min(1, "Name is required").optional(),
    phone: z.string().optional().nullable(),
    metadata: z.record(z.string(), z.string()).optional(),
  });

  // Get customer by ID
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

  // Create customer
  fastify.post("/", async (request, reply) => {
    try {
      const validationResult = customerCreateSchema.safeParse(request.body);
      if (!validationResult.success) {
        return reply.status(400).send({
          error: "Validation failed",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      const customer = await stripe.customers.create(validationResult.data);
      return reply.send(customer);
    } catch (error) {
      request.log.error({ err: error }, "Error creating customer");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Update customer
  fastify.put("/", async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }

      const validationResult = customerUpdateSchema.safeParse(request.body);
      if (!validationResult.success) {
        return reply.status(400).send({
          error: "Validation failed",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      const customer = await stripe.customers.update(
        customer_id,
        validationResult.data,
      );
      return reply.send(customer);
    } catch (error) {
      request.log.error({ err: error }, "Error updating customer");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Get customer subscriptions
  fastify.get("/subscriptions", async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<
        string,
        any
      >;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }

      // Validate limit parameter
      let limitValue = 10; // default
      if (typeof limit === "string") {
        const parsed = parseInt(limit);
        if (
          isNaN(parsed) ||
          !Number.isInteger(parsed) ||
          parsed < 1 ||
          parsed > 100
        ) {
          return reply.status(400).send({
            error:
              "Invalid limit parameter. Must be an integer between 1 and 100.",
          });
        }
        limitValue = parsed;
      }

      const params: Stripe.SubscriptionListParams = {
        customer: customer_id,
        limit: limitValue,
      };

      if (typeof starting_after === "string") {
        params.starting_after = starting_after;
      }

      const subscriptions = await stripe.subscriptions.list(params);
      return reply.send(subscriptions);
    } catch (error) {
      request.log.error(
        { err: error },
        "Error fetching customer subscriptions",
      );
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Get customer payment intents
  fastify.get("/payments", async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<
        string,
        any
      >;
      if (!customer_id || typeof customer_id !== "string") {
        return reply.status(400).send({ error: "customer_id is required" });
      }

      // Validate limit parameter
      let limitValue = 10; // default
      if (typeof limit === "string") {
        const parsed = parseInt(limit);
        if (
          isNaN(parsed) ||
          !Number.isInteger(parsed) ||
          parsed < 1 ||
          parsed > 100
        ) {
          return reply.status(400).send({
            error:
              "Invalid limit parameter. Must be an integer between 1 and 100.",
          });
        }
        limitValue = parsed;
      }

      const params: Stripe.PaymentIntentListParams = {
        customer: customer_id,
        limit: limitValue,
      };

      if (typeof starting_after === "string") {
        params.starting_after = starting_after;
      }

      const paymentIntents = await stripe.paymentIntents.list(params);
      return reply.send(paymentIntents);
    } catch (error) {
      request.log.error({ err: error }, "Error fetching customer payments");
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
