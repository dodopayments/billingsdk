import { Router} from "express";
import type { Response, Request } from "express";
import { z } from "zod";
import { createCustomer, updateCustomer, getCustomerPayments } from "../../lib/dodopayments"; 
import { getDodoPaymentsClient } from "../../lib/dodopayments";

const router = Router();


const customerIdSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

const createCustomerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
});

const updateCustomerSchema = z.object({
  name: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
});




router.get("/", async (req: Request, res: Response) => {
  try {
    const validation = customerIdSchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({ error: validation?.error?.issues[0]?.message });
    }

    const { customer_id } = validation.data;
    const customer = await getDodoPaymentsClient().customers.retrieve(customer_id);
    return res.json(customer);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return res.status(500).json({ error: "Failed to retrieve customer" });
  }
});


router.post("/", async (req: Request, res: Response) => {
  try {
    const validation = createCustomerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues[0]?.message });
    }

    const customerData = {
      ...validation.data,
      phone_number: validation.data.phone_number ?? null,
    };
    const customer = await createCustomer(customerData); 
    return res.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Failed to create customer" });
  }
});


router.put("/", async (req: Request, res: Response) => {
  try {
    const idValidation = customerIdSchema.safeParse(req.query);
    if (!idValidation.success) {
      return res.status(400).json({ error: idValidation.error.issues[0]?.message });
    }

    const updateValidation = updateCustomerSchema.safeParse(req.body);
    if (!updateValidation.success) {
      return res.status(400).json({ error: updateValidation.error.issues[0]?.message });
    }

    const { customer_id } = idValidation.data;
    const updateData = {
      name: typeof updateValidation.data.name !== "undefined" ? updateValidation.data.name : null,
      phone_number: typeof updateValidation.data.phone_number !== "undefined" ? updateValidation.data.phone_number : null,
    };
    const customer = await updateCustomer(customer_id, updateData);
    return res.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ error: "Failed to update customer" });
  }
});


export default router;