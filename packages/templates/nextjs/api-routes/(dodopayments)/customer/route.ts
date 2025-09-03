import { getDodoPaymentsClient } from "@/lib/dodopayments";
import { NextResponse } from "next/server";
import { z } from "zod";

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
});

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const queryParams = {
            customer_id: url.searchParams.get('customer_id'),
        };
        const validationResult = customerIdSchema.safeParse(queryParams);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { customer_id } = validationResult.data;
        const customer = await getDodoPaymentsClient().customers.retrieve(customer_id);
        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error retrieving customer:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve customer' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validationResult = createCustomerSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const customer = await getDodoPaymentsClient().customers.create(validationResult.data);
        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const customer_id = url.searchParams.get('customer_id');
        const body = await request.json();

        const customerIdValidation = customerIdSchema.safeParse({ customer_id });
        if (!customerIdValidation.success) {
            return NextResponse.json(
                { error: customerIdValidation.error.issues[0].message },
                { status: 400 }
            );
        }

        const updateValidation = updateCustomerSchema.safeParse(body);
        if (!updateValidation.success) {
            return NextResponse.json(
                { error: updateValidation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { customer_id: validCustomerId } = customerIdValidation.data;
        const customer = await getDodoPaymentsClient().customers.update(validCustomerId, updateValidation.data);
        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: 'Failed to update customer' },
            { status: 500 }
        );
    }
}