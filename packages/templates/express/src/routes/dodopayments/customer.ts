import express from 'express';
import { z } from 'zod';
import { 
  validateRequest, 
  validateQuery, 
  retrieveCustomer, 
  createCustomer, 
  updateCustomer 
} from '../../lib/dodopayments';

const router = express.Router();

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
}).refine((data) => data.name !== undefined || data.phone_number !== undefined, {
  message: 'At least one field must be provided for update',
  path: ['name'],
});

router.get('/', validateQuery(customerIdSchema), async (req, res, next) => {
  try {
    const { customer_id } = req.query as { customer_id: string };
    const customer = await retrieveCustomer(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateRequest(createCustomerSchema), async (req, res, next) => {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

router.put('/', validateQuery(customerIdSchema), validateRequest(updateCustomerSchema), async (req, res, next) => {
  try {
    const { customer_id } = req.query as { customer_id: string };
    const customer = await updateCustomer(customer_id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

export default router;
