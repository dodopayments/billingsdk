import express from 'express';
import { getStripe } from '../../lib/stripe';
import type Stripe from 'stripe';

const router = express.Router();
const stripe = getStripe();


router.get('/', async (req, res) => {
  try {
    const { subscription_id } = req.query;

    if (!subscription_id || typeof subscription_id !== 'string') {
      return res.status(400).json({ error: 'subscription_id is required' });
    }

    const subscription = await stripe.subscriptions.retrieve(subscription_id);
    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});


router.get('/list', async (req, res) => {
  try {
    const { customer_id, limit, starting_after } = req.query;

    if (!customer_id || typeof customer_id !== 'string') {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    const params: Stripe.SubscriptionListParams = {
      customer: customer_id,
    };

    if (limit && typeof limit === 'string') {
      const parsed = parseInt(limit, 10);
      if (!isNaN(parsed)) params.limit = parsed;
    }

    if (starting_after && typeof starting_after === 'string') {
      params.starting_after = starting_after;
    }

    const subscriptions = await stripe.subscriptions.list(params);
    res.json(subscriptions.data); // return only the subscriptions array
  } catch (error) {
    console.error('Error fetching subscriptions list:', error);
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});

export { router as subscriptionsRouter };
