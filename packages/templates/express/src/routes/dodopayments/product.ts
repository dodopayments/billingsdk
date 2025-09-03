import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { getProducts, getProduct } from "../../lib/dodopayments";

const router = Router();


const productIdSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
});

// GET /products → list all products
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await getProducts();
    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /products/:product_id → retrieve single product
router.get("/:product_id", async (req: Request, res: Response) => {
  try {
    const validation = productIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.issues[0]?.message });
    }

    const { product_id } = validation.data;
    const product = await getProduct(product_id);

    return res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({ error: "Failed to retrieve product" });
  }
});

export default router;
