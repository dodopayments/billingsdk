import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { getCustomerSubscriptions } from "../../lib/dodopayments";

const router = Router();


const subscriptionQuerySchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});


router.get("/", async (req: Request, res: Response) => {
  try {
    const validation = subscriptionQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.issues[0]?.message });
    }

    const { customer_id } = validation.data;
    const subscriptions = await getCustomerSubscriptions(customer_id);

    return res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

export default router;