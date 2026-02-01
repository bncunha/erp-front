export interface BillingSummaryResponse {
  plan_name: string;
  plan_price: number;
  last_payment_at?: string | null;
  next_payment_at: string;
  status: string;
}

export interface BillingPaymentResponse {
  id: number;
  plan_name: string;
  provider: string;
  status: string;
  amount: number;
  paid_at?: string | null;
  created_at: string;
}

export interface BillingStatusResponse {
  plan_name: string;
  current_period_end: string;
  can_write: boolean;
  reason?: string;
}
