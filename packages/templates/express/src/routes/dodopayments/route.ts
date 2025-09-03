import { Router } from "express";
import { router as checkoutRouter } from "./checkout";
import { router as customersRouter } from "./customer";
import { router as paymentsRouter } from "./payments";
import { router as productsRouter } from "./products";
import { router as subscriptionsRouter } from "./subscriptions";
import { router as webhookRouter } from "./webhook";

export const router = Router();

// Mount webhook FIRST so it can use raw body without interference
router.use("/webhook", webhookRouter);

// Parse JSON for all non-webhook routes
router.use(require("express").json());

// Mount sub-routers
router.use("/checkout", checkoutRouter);
router.use("/customers", customersRouter);
router.use("/payments", paymentsRouter);
router.use("/products", productsRouter);
router.use("/subscriptions", subscriptionsRouter);

// Centralized error handler to keep consistent error responses
router.use((err: unknown, _req: any, res: any, _next: any) => {
  const status = (err as any)?.status ?? 500;
  const message = (err as any)?.message ?? "Internal server error";
  const details = (err as any)?.details;
  res.status(status).json({ error: message, ...(details ? { details } : {}) });
});


