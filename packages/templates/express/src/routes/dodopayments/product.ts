import express from 'express';
import { getDodoPaymentsClient } from '../../lib/dodopayments';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { product_id } = req.query;

        if (!product_id || typeof product_id !== 'string') {
            return res.status(400).json({ error: 'product_id is required' });
        }

        const product = await getDodoPaymentsClient().products.retrieve(product_id);
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as productRouter };