import express from 'express';
import { getDodoPaymentsClient } from '../../lib/dodopayments';
import { z } from 'zod';

const router = express.Router();

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

        const customer = await getDodoPaymentsClient().customers.retrieve(customer_id);
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

        const customer = await getDodoPaymentsClient().customers.create(validationResult.data);
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

        const customer = await getDodoPaymentsClient().customers.update(customer_id, validationResult.data);
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

        const subscriptions = await getDodoPaymentsClient().subscriptions.list({
            customer_id: customer_id
        });
        res.json(subscriptions);
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

        const payments = await getDodoPaymentsClient().payments.list({
            customer_id: customer_id
        });
        res.json(payments);
    } catch (error) {
        console.error('Error fetching customer payments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as customerRouter };
