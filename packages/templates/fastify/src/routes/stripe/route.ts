// @ts-nocheck
import { FastifyInstance } from "fastify";
import checkoutRoutes from "./checkout";
import customerRoutes from "./customer";
import paymentsRoutes from "./payments";
import productsRoutes from "./products";
import subscriptionsRoutes from "./subscriptions";
import webhookRoutes from "./webhook";

export default async function stripeRoutes(fastify: FastifyInstance) {
  await fastify.register(checkoutRoutes, { prefix: "/checkout" });
  await fastify.register(customerRoutes, { prefix: "/customer" });
  await fastify.register(paymentsRoutes, { prefix: "/payments" });
  await fastify.register(productsRoutes, { prefix: "/products" });
  await fastify.register(subscriptionsRoutes, { prefix: "/subscriptions" });
  await fastify.register(webhookRoutes, { prefix: "/webhook" });
}
