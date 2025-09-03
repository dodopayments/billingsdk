import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

export const router = Router();

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone_number: z.string().optional().nullable(),
});

const updateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  phone_number: z.string().optional().nullable(),
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createSchema.parse(req.body);
    const created = await getDodoPaymentsClient().customers.create(body);
    res.json(created);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = z.object({ id: z.string().min(1) }).parse(req.params);
      const customer = await getDodoPaymentsClient().customers.retrieve(params.id);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = z.object({ id: z.string().min(1) }).parse(req.params);
      const body = updateSchema.parse(req.body);
      const customer = await getDodoPaymentsClient().customers.update(params.id, body);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/subscriptions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = z.object({ id: z.string().min(1) }).parse(req.params);
      const subs = await getDodoPaymentsClient().subscriptions.list({
        customer_id: params.id,
      });
      res.json(subs);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/payments",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = z.object({ id: z.string().min(1) }).parse(req.params);
      const payments = await getDodoPaymentsClient().payments.list({
        customer_id: params.id,
      });
      res.json(payments);
    } catch (err) {
      next(err);
    }
  }
);


