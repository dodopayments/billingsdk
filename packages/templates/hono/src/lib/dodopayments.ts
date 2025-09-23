import { DodoPayments } from 'dodopayments'

let dodopaymentsClient: DodoPayments | null = null

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    const token = process.env.DODO_PAYMENTS_API_KEY
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode"

    if (!token) {
      throw new Error(`
        DODO_PAYMENTS_API_KEY environment variable is missing.
        
        Please check:
        1. Your .env file exists in the project root
        2. The file contains: DODO_PAYMENTS_API_KEY=<your-api-key>
        3. You've restarted your development server
        4. No extra quotes or spaces in the .env file
      `)
    }

    if (!environment || (environment !== "live_mode" && environment !== "test_mode")) {
      throw new Error('DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"')
    }

    dodopaymentsClient = new DodoPayments({
      bearerToken: token,
      environment: environment,
    })
  }

  return dodopaymentsClient
}