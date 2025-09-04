import express from 'express';
import { getDodoPaymentsClient } from '../../lib/dodopayments';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { subscription_id } = req.query;

        if (!subscription_id || typeof subscription_id !== 'string') {
            return res.status(400).json({ error: 'subscription_id is required' });
        }

        const subscription = await getDodoPaymentsClient().subscriptions.retrieve(subscription_id);
        res.json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
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

        const subscriptions = await getDodoPaymentsClient().subscriptions.list(params);
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as subscriptionsRouter };
