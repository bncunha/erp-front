import {
  BillingPaymentResponse,
  BillingStatusResponse,
  BillingSummaryResponse,
} from '../../service/responses/billing-response';
import {
  BillingPaymentViewModel,
  BillingStatusViewModel,
  BillingSummaryViewModel,
} from '../../service/models/billing.models';

const parseDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }
  return new Date(value);
};

export const mapBillingSummaryResponse = (
  response: BillingSummaryResponse
): BillingSummaryViewModel => {
  return {
    planName: response.plan_name,
    planPrice: response.plan_price,
    lastPaymentAt: parseDate(response.last_payment_at),
    nextPaymentAt: new Date(response.next_payment_at),
    status: response.status,
  };
};

export const mapBillingPaymentResponse = (
  response: BillingPaymentResponse
): BillingPaymentViewModel => {
  return {
    id: response.id,
    planName: response.plan_name,
    provider: response.provider,
    status: response.status,
    amount: response.amount,
    paidAt: parseDate(response.paid_at),
    createdAt: new Date(response.created_at),
  };
};

export const mapBillingStatusResponse = (
  response: BillingStatusResponse
): BillingStatusViewModel => {
  return {
    planName: response.plan_name,
    currentPeriodEnd: new Date(response.current_period_end),
    canWrite: response.can_write,
    reason: response.reason,
  };
};
