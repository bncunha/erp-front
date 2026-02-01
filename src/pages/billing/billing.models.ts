import {
  BillingPaymentViewModel,
  BillingSummaryViewModel,
} from '../../service/models/billing.models';

export interface BillingPageState {
  summary: BillingSummaryViewModel | null;
  payments: BillingPaymentViewModel[];
  summaryLoading: boolean;
  paymentsLoading: boolean;
  summaryErrorMessage: string | null;
  paymentsErrorMessage: string | null;
}
