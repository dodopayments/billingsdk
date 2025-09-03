import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

export const router = Router();

router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = z
        .object({ id: z.string().min(1, "Payment ID is required") })
        .parse(req.params);

      const payment = await getDodoPaymentsClient().payments.retrieve(params.id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }
);

