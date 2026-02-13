import { PaymentTypeEnum } from '../../enums/payment-type.enum';
import { PaymentEnum } from '../../enums/payment.enum';

export interface GetAllSalesResponse {
  summary: GetSummaryResponse;
  sales: GetSimplifiedSaleResponse[];
}

export interface GetSummaryResponse {
  total_sales: number;
  total_items: number;
  received_value: number;
  future_revenue: number;
  average_ticket: number;
}

export interface GetSimplifiedSaleResponse {
  id: number;
  date: string;
  seller_name: string;
  customer_name: string;
  total_value: number;
  total_items: number;
  status: PaymentEnum;
}

export interface GetSaleResponse {
  id: number;
  code: string;
  date: string;
  total_value: number;
  seller_name: string;
  customer_name: string;
  received_value: number;
  future_revenue: number;
  payment_status: string;
  payments: GetSalePaymentResponse[];
  items: GetSaleItemResponse[];
  returns: GetSaleReturnResponse[];
}

export interface GetSalePaymentResponse {
  payment_type: PaymentTypeEnum;
  installments: GetSaleInstallmentResponse[];
}

export class GetSaleInstallmentResponse {
  id!: number;
  installment_number!: number;
  installment_value!: number;
  due_date!: string;
  paid_date?: string;
  payment_status!: string;
  payment_type!: PaymentTypeEnum;
}

export interface GetSaleItemResponse {
  sku_id: number;
  code: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_value: number;
}

export interface GetSaleReturnResponse {
  id: number;
  return_date: string;
  returner: string;
  reason: string;
  items: GetSaleReturnItemResponse[];
}

export interface GetSaleReturnItemResponse {
  code: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_value: number;
}
