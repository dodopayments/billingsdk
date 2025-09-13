import { CheckoutPaymentIntent, Client, Environment, OrdersController } from '@paypal/paypal-server-sdk';

/**
 * PayPal SDK configuration
 * 
 * This file sets up the PayPal client with the appropriate environment
 * based on the PAYPAL_ENV environment variable.
 */

// Create PayPal client
const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
  environment: process.env.PAYPAL_ENV === 'live' ? Environment.Production : Environment.Sandbox,
});

// Create orders controller
const ordersController = new OrdersController(paypalClient);

/**
 * Create a PayPal order
 * 
 * @param amount - The amount to charge
 * @param currency - The currency code (e.g., 'USD')
 * @param description - Description of the purchase
 * @returns Promise resolving to the order ID
 */
export const createPayPalOrder = async (
  amount: string,
  currency: string = 'USD',
  description: string = 'BillingSDK Purchase'
) => {
  try {
    const order = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            description,
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
        applicationContext: {
          cancelUrl: `${process.env.VITE_APP_URL || process.env.REACT_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cancel`,
          returnUrl: `${process.env.VITE_APP_URL || process.env.REACT_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/return`,
        },
      },
    });
    
    return order.result.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

/**
 * Capture a PayPal order
 * 
 * @param orderId - The PayPal order ID to capture
 * @returns Promise resolving to the capture result
 */
export const capturePayPalOrder = async (orderId: string) => {
  try {
    const capture = await ordersController.captureOrder({
      id: orderId,
    });
    return capture.result;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
};

/**
 * Get order details
 * 
 * @param orderId - The PayPal order ID to retrieve
 * @returns Promise resolving to the order details
 */
export const getPayPalOrder = async (orderId: string) => {
  try {
    const order = await ordersController.getOrder({
      id: orderId,
    });
    return order.result;
  } catch (error) {
    console.error('Error retrieving PayPal order:', error);
    throw error;
  }
};