import { getStripe } from '../../lib/stripe';
import { z } from 'zod';
import type Stripe from 'stripe';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

const stripe = getStripe();

const customerCreateSchema = z.object({
  email: z.email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
});

const customerUpdateSchema = z.object({
  email: z.email("Invalid email format").optional(),
  name: z.string().min(1, "Name is required").optional(),
  phone_number: z.string().optional().nullable(),
});


const router = new Hono()
  .get('/:customer_id', zValidator('param', z.object({ customer_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({
        error: "customer_id parameter is required",
      }, 400)
    }
  }), async (c) => {
    try {
      const { customer_id } = c.req.valid('param');
      const customer = await stripe.customers.retrieve(customer_id);
      return c.json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .post('/',
    zValidator('json', customerCreateSchema, (result, c) => {
      if (!result.success) {
        return c.json({
          error: "Validation failed",
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { email, name, phone_number } = c.req.valid('json');
        const customer = await stripe.customers.create({
          email: email,
          name: name,
          phone: phone_number ?? "",
        });

        return c.json(customer);
      } catch (error) {
        console.error('Error creating customer:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    })
  .put('/:customer_id',
    zValidator('param', z.object({ customer_id: z.string() }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "customer_id query parameter is required",
        }, 400)
      }
    }),
    zValidator('json', customerUpdateSchema, (result, c) => {
      if (!result.success) {
        return c.json({
          error: "Validation failed",
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { customer_id } = c.req.valid('param');
        const { email, name, phone_number } = c.req.valid('json');
        const updateData: Stripe.CustomerUpdateParams = {};
        if (email) updateData.email = email;
        if (name) updateData.name = name;
        if (phone_number) updateData.phone = phone_number;

        const customer = await stripe.customers.update(customer_id, updateData);
        return c.json(customer);
      } catch (error) {
        console.error('Error updating customer:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    })
  .get('/subscriptions/:customer_id',
    zValidator('param', z.object({ customer_id: z.string() }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "customer_id query parameter is required",
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { customer_id } = c.req.valid('param')
        const subscriptions = await stripe.subscriptions.list({
          customer: customer_id,
          limit: 100,
        });

        return c.json(subscriptions.data);
      } catch (error) {
        console.error('Error fetching customer subscriptions:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    })
  .get('/payments/:customer_id',
    zValidator('param', z.object({ customer_id: z.string() }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "customer_id query parameter is required",
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { customer_id } = c.req.valid('param');
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customer_id,
          limit: 100,
        });

        return c.json(paymentIntents.data);
      } catch (error) {
        console.error('Error fetching customer payments:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    });

export { router as customerRouter };
