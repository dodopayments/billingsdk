import { DodoPayments } from "dodopayments";
import { z } from 'zod'

const dodoPaymentsEnvSchema = z.object({
  DODO_PAYMENTS_API_KEY: z.string().min(1, 'DODO_PAYMENTS_API_KEY is required'),
  DODO_PAYMENTS_ENVIRONMENT: z.enum(['live_mode', 'test_mode'], {
    errorMap: () => ({ message: 'DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"' })
  }),
  DODO_PAYMENTS_WEBHOOK_KEY: z.string().min(1, 'DODO_PAYMENTS_WEBHOOK_KEY is required'),
})

// Validate environment variables at module load time (fails fast!)
function validateDodoPaymentsEnv() {
  const result = dodoPaymentsEnvSchema.safeParse(process.env)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n')
    throw new Error(`DodoPayments environment validation failed: ${errors}

Please check:
1. Your .env file exists in the project root
2. All required variables are set correctly
3. You've restarted your development server
4. No extra quotes or spaces in the .env file

Required variables:
- DODO_PAYMENTS_API_KEY: Your DodoPayments API key
- DODO_PAYMENTS_ENVIRONMENT: Either "live_mode" or "test_mode"
- DODO_PAYMENTS_WEBHOOK_KEY: Your DodoPayments webhook secret key
    `)
  }
  
  return result.data
}

// Validate once at module load
const validatedEnv = validateDodoPaymentsEnv()

// Export for use in webhook handlers
export { validatedEnv }

let dodopaymentsClient: DodoPayments | null = null;

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    dodopaymentsClient = new DodoPayments({
      bearerToken: validatedEnv.DODO_PAYMENTS_API_KEY,
      environment: validatedEnv.DODO_PAYMENTS_ENVIRONMENT,
    });
  }

  return dodopaymentsClient;
}
