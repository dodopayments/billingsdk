import { Hono } from "hono";
import { getDodoPaymentsClient } from "../../lib/dodopayments";
import { z } from "zod"

const app = new Hono();

const customerCreateSchema = z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(1, "Name is required"),
    phone_number: z.string().optional().nullable(),
});

const customerUpdateSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    name: z.string().min(1, "Name is required").optional(),
    phone_number: z.string().optional().nullable(),
})


app.get('/', async (c) => {
    try {
        const customer_id  = c.req.query('customer_id');

        if (!customer_id || typeof customer_id !== "string") {
            return c.json({ error: "customer_id is required" }, 400)
        }

        const customer = await getDodoPaymentsClient().customers.retrieve(customer_id)
        return c.json(customer)
    } catch (error) {
        console.error("Error fetching customer", error);
        return c.json({ error: "internal server error" }, 500)
    }
})

app.post('/', async (c) => {
    try {
        const body = c.req.json()
        const validatedResult = customerCreateSchema.safeParse(body);

        if(!validatedResult.success) {
            return c.json({
                error: "Validation failed",
                details: validatedResult.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            }, 400)
        }

        const customer = await getDodoPaymentsClient().customers.create(validatedResult.data)
        return c.json(customer)

    } catch (error) {

        console.error("Error while creating new customer:", error);
        return c.json({error: "Internal server error"}, 500)
    }
});

app.put('/', async (c) => {
    try {
        const customer_id = c.req.query('customer_id');

        if(!customer_id || typeof customer_id !== "string") {
            return c.json({error: "customer_id is required"}, 400)
        }

        const body = c.req.json()
        const validatedResult = customerUpdateSchema.safeParse(body)

        if(!validatedResult.success) {
            return c.json({
                error: "Validation failed",
                details: validatedResult.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            }, 400)
        }

        const customer = await getDodoPaymentsClient().customers.update(customer_id, validatedResult.data)
        return c.json(customer)

    } catch (error) {
        console.error("Error while updating customer:", error)
        return c.json({error: "Internal server error"}, 500)
    }
})

app.get('/subscriptions', async (c) => {
    try {
        const customer_id = c.req.query('customer_id')
        
        if(!customer_id || typeof customer_id !== "string") {
            return c.json({error: "customer_id is required"}, 400)
        }

        const subscriptions = await getDodoPaymentsClient().subscriptions.list({
            customer_id: customer_id
        })

        return c.json(subscriptions)

    } catch (error) {
        console.error("Error while fetching customer subscriptions:", error)
        return c.json({error: "internal server error"}, 500)
    }
})

app.get('/payments', async (c) => {
    try {
        const customer_id = c.req.query('customer_id')

        if(!customer_id || typeof customer_id !== "string") {
            return c.json({error: "customer_id is required"}, 400)
        }

        const payments = await getDodoPaymentsClient().payments.list({
            customer_id: customer_id
        })
        return c.json(payments)

    } catch (error) {
        console.error("Error fetching customer payments", error)
        return c.json({error: "internal server error"}, 500)
    }
})

export { app as customerRouter }