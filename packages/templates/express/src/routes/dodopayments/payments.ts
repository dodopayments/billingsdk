import { Router } from "express";
import type {Response, Request} from "express"
import { z } from "zod";
import { getCustomerPayments } from "../../lib/dodopayments";

const router = Router();


const paymentQuerySchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});


router.get("/", async (req: Request, res: Response) => {
  try {
    const validation = paymentQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.issues[0]?.message });
    }

    const { customer_id } = validation.data;
    const payments = await getCustomerPayments(customer_id);

    return res.json(payments);
  } catch (error) {
    console.error("Error fetching customer payments:", error);
    return res.status(500).json({ error: "Failed to fetch customer payments" });
  }
});

export default router;
