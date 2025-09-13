import express from 'express';
import { getStripe } from '../../lib/stripe';

const stripe = getStripe()
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { payment_id } = req.query;

        if (!payment_id || typeof payment_id !== 'string') {
            return res.status(400).json({ error: 'payment_id is required' });
        }

        const payment = await stripe.paymentIntents.retrieve(payment_id);
        res.json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const { customer_id, limit, starting_after } = req.query;

        const params: any = {};
        if (customer_id && typeof customer_id === 'string') {
            params.customer_id = customer_id;
        }
        if (limit && typeof limit === 'string') {
            params.limit = parseInt(limit);
        }
        if (starting_after && typeof starting_after === 'string') {
            params.starting_after = starting_after;
        }

        const payments = await stripe.paymentIntents.list(params);
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as paymentsRouter };
