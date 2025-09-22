import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";

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

const customerIdSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      customer_id: url.searchParams.get("customer_id"),
    };
    const validationResult = customerIdSchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { customer_id } = validationResult.data;
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customer_id);
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = customerCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const customer = await stripe.customers.create({
      email: validationResult.data.email,
      name: validationResult.data.name,
      phone: validationResult.data.phone_number ?? "",
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const customer_id = url.searchParams.get("customer_id");
    const body = await request.json();

    const customerIdValidation = customerIdSchema.safeParse({ customer_id });
    if (!customerIdValidation.success) {
      return NextResponse.json(
        { error: customerIdValidation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updateValidation = customerUpdateSchema.safeParse(body);
    if (!updateValidation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: updateValidation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { customer_id: validCustomerId } = customerIdValidation.data;
    const stripe = getStripe();

    const updateData: Stripe.CustomerUpdateParams = {};
    if (updateValidation.data.email)
      updateData.email = updateValidation.data.email;
    if (updateValidation.data.name)
      updateData.name = updateValidation.data.name;
    if (updateValidation.data.phone_number)
      updateData.phone = updateValidation.data.phone_number;

    const customer = await stripe.customers.update(validCustomerId, updateData);
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
