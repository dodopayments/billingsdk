import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getDodoPaymentsClient } from "../../lib/dodopayments";

export const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getDodoPaymentsClient().products.list();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = z
        .object({ id: z.string().min(1, "Product ID is required") })
        .parse(req.params);

      const product = await getDodoPaymentsClient().products.retrieve(params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

