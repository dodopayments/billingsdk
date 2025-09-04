import {DodoPayments} from 'dodopayments';
import type { PaymentListResponse, ProductListResponse, SubscriptionListResponse } from 'dodopayments/resources.mjs';
type Product = DodoPayments.Product;

let dodopaymentsClient: DodoPayments | null = null;

export function getDodoPaymentsClient(): DodoPayments {
    if(!dodopaymentsClient){
        const token = process.env.DODO_PAYMENTS_API_KEY;
        const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode"


    console.log('Initializing DodoPayments client...')
    console.log('Token exists:', !!token)
    console.log('Environment:', environment)
    
    if(!token) {
       throw new Error(`
            DODO_PAYMENTS_API_KEY environment variable is missing.
            
            Please check:
            1. Your .env.local file exists in the project root
            2. The file contains: DODO_PAYMENTS_API_KEY=<your-api-key>
            3. You've restarted your development server
            4. No extra quotes or spaces in the .env.local file
        `)
   
    }
    if (!environment || (environment !== "live_mode" && environment !== "test_mode")) {
      throw new Error('DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"')
    }

    dodopaymentsClient = new DodoPayments({
        bearerToken: token,
        environment: environment
    })

    }

    return dodopaymentsClient;

}


export async function getProducts(): Promise<ProductListResponse[]> {
    try{
        const client = getDodoPaymentsClient();
        const response = await client.products.list();
        return response.items; 
    } catch(error){
        console.error("Error fetching product_list", error);
        throw new Error("Failed to fetch product_list");
    }
}

export async function getProduct(product_id: string): Promise<Product> {
    try{
        const client = getDodoPaymentsClient();
        return await client.products.retrieve(product_id);
    
    } catch(error) {
        console.error("Error fetching product", error);
        throw new Error("Failed to fetch product");        
    }
}

export async function getCustomer(customer_id: string): Promise<DodoPayments.Customers.Customer> {
    try{
        const client = getDodoPaymentsClient();
        return await client.customers.retrieve(customer_id);
    } catch(error) {
        console.error("Error fetch customer", error)
        throw new Error("Failed to fetch customer details");
    }

}

export async function getCustomerSubscriptions(customer_id: string): Promise<SubscriptionListResponse[]> {

    try{
        const client = getDodoPaymentsClient();
        const response = await client.subscriptions.list({
            customer_id: customer_id
        });
        return response.items
    } catch(error) {
        console.error("Error fetching subscriptions", error);
        throw new Error("Failed to fetch customer's subscriptions");
    }
    
}

export async function getCustomerPayments(customer_id: string): Promise<PaymentListResponse[]> {

    try{
        const client = getDodoPaymentsClient();
        const response = await client.payments.list({
            customer_id: customer_id
        });
        return response.items
    } catch(error) {
        console.error("Error fetching payments list", error);
        throw new Error("Failed to fetch customer's payments list");

    }
    
}

export async function createCustomer(params: DodoPayments.Customers.CustomerCreateParams): Promise<DodoPayments.Customers.Customer> {
    try{
        const client = getDodoPaymentsClient();
        return await client.customers.create(params);
    } catch(error) {
        console.error("Error creating customer", error);
        throw new Error("Failed to create customer");
    }
        
}

export async function updateCustomer(customer_id: string, params: DodoPayments.Customers.CustomerUpdateParams): Promise<DodoPayments.Customers.Customer> {
    try{
        const client = getDodoPaymentsClient();
        return await client.customers.update(customer_id, params);
    } catch(error) {
        console.error("Error updating customer", error);
        throw new Error("Failed to update customer");
    }
    
}

export async function checkout(productCart: Array<{ product_id: string; quantity: number; amount?: number }>, customer: DodoPayments.Payments.CustomerRequest, billing_address: DodoPayments.Payments.BillingAddress, return_url: string, customMetadata?: Record<string, string>) {
    try {
        const client = getDodoPaymentsClient();
        return await client.checkoutSessions.create({
            product_cart: productCart,
            customer: customer,
            billing_address: billing_address as DodoPayments.Payments.BillingAddress,
            return_url: return_url,
            metadata: customMetadata ?? null
        });
    } catch(error) {
        console.error("Error checking out", error);
        throw new Error("Failed checking out")
    }
    
}
