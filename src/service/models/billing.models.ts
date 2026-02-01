export interface BillingSummaryViewModel {
  planName: string;
  planPrice: number;
  lastPaymentAt: Date | null;
  nextPaymentAt: Date;
  status: string;
}

export interface BillingPaymentViewModel {
  id: number;
  planName: string;
  provider: string;
  status: string;
  amount: number;
  paidAt: Date | null;
  createdAt: Date;
}

export interface BillingStatusViewModel {
  planName: string;
  currentPeriodEnd: Date;
  canWrite: boolean;
  reason?: string;
}
