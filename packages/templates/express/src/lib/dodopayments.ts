import { DodoPayments } from "dodopayments";
import dotenv from "dotenv";
dotenv.config();
let dodopaymentsClient: DodoPayments | null = null;

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    const token = process.env.DODO_PAYMENTS_API_KEY;
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as
      | "live_mode"
      | "test_mode";

    if (!token) {
      throw new Error(
        "DODO_PAYMENTS_API_KEY is missing. Please set it in your environment."
      );
    }

    if (!environment || (environment !== "live_mode" && environment !== "test_mode")) {
      throw new Error(
        'DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"'
      );
    }

    dodopaymentsClient = new DodoPayments({
      bearerToken: token,
      environment: environment,
    });
  }

  return dodopaymentsClient;
}


