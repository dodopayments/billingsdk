import { Hono } from 'hono';
import { getDodoPaymentsClient } from '../../lib/dodopayments';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

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

const router = new Hono().
  get('/', zValidator('query', z.object({ customer_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({ error: 'customer_id is required' }, 400);
    }
  }), async (c) => {
    try {
      const { customer_id } = c.req.valid('query')
      const customer = await getDodoPaymentsClient().customers.retrieve(customer_id);
      return c.json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .post('/', zValidator('json', customerCreateSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        error: "Validation failed",
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, 400)
    }
  }), async (c) => {
    try {
      const customerData = c.req.valid('json')
      const customer = await getDodoPaymentsClient().customers.create(customerData);
      return c.json(customer);
    } catch (error) {
      console.error('Error creating customer:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .put('/', zValidator('query', z.object({ customer_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({ error: 'customer_id is required' }, 400);
    }
  }), zValidator('json', customerUpdateSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        error: "Validation failed",
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, 400)
    }
  }), async (c) => {
    try {
      const { customer_id } = c.req.valid('query')
      const updateData = c.req.valid('json')
      const customer = await getDodoPaymentsClient().customers.update(customer_id, updateData);
      return c.json(customer);
    } catch (error) {
      console.error('Error updating customer:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .get('/subscriptions', zValidator('query', z.object({ customer_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({ error: 'customer_id is required' }, 400);
    }
  }), async (c) => {
    try {
      const { customer_id } = c.req.valid('query')
      const subscriptions = await getDodoPaymentsClient().subscriptions.list({
        customer_id: customer_id,
      });
      return c.json(subscriptions);
    } catch (error) {
      console.error('Error fetching customer subscriptions:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .get('/payments', zValidator('query', z.object({ customer_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({ error: 'customer_id is required' }, 400);
    }
  }), async (c) => {
    try {
      const { customer_id } = c.req.valid('query')

      const payments = await getDodoPaymentsClient().payments.list({
        customer_id: customer_id,
      });
      return c.json(payments);
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

export { router as customerRouter };
