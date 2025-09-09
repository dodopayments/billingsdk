import express from 'express';
import { getStripe } from '../../lib/stripe';
import { z } from 'zod';
import type Stripe from 'stripe';

const router = express.Router();
const stripe = getStripe();

const customerCreateSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
});

const customerUpdateSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(1, "Name is required").optional(),
  phone_number: z.string().optional().nullable(),
});


router.get('/', async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id || typeof customer_id !== 'string') {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    const customer = await stripe.customers.retrieve(customer_id);
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /customer
router.post('/', async (req, res) => {
  try {
    const validationResult = customerCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    const customer = await stripe.customers.create({
      email: validationResult.data.email,
      name: validationResult.data.name,
      phone: validationResult.data.phone_number ?? "",
    });

    res.json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/', async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id || typeof customer_id !== 'string') {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    const validationResult = customerUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    const updateData: Stripe.CustomerUpdateParams = {};
    if (validationResult.data.email) updateData.email = validationResult.data.email;
    if (validationResult.data.name) updateData.name = validationResult.data.name;
    if (validationResult.data.phone_number) updateData.phone = validationResult.data.phone_number;

    const customer = await stripe.customers.update(customer_id, updateData);
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/subscriptions', async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id || typeof customer_id !== 'string') {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      limit: 100,
    });

    res.json(subscriptions.data);
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/payments', async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id || typeof customer_id !== 'string') {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    const paymentIntents = await stripe.paymentIntents.list({
      customer: customer_id,
      limit: 100,
    });

    res.json(paymentIntents.data);
  } catch (error) {
    console.error('Error fetching customer payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as customerRouter };
