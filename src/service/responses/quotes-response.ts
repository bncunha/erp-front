export type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELED';

export type QuoteShippingType =
  | 'FREE'
  | 'FREE_REGION'
  | 'FREE_MIN_VALUE'
  | 'TO_CALCULATE';

export interface QuoteCustomerResponse {
  id: number;
  name: string;
  phone: string;
}

export interface QuoteCompanyResponse {
  name: string;
  legal_name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string | null;
}

export interface QuoteItemResponse {
  id: number;
  sku_id: number;
  product_id: number;
  sku_code: string;
  product_description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface QuoteResponse {
  id: number;
  quote_number: string;
  company: QuoteCompanyResponse;
  customer: QuoteCustomerResponse;
  status: QuoteStatus;
  valid_until: string;
  down_payment_percentage: number;
  discount_percentage: number;
  discount_amount: number;
  shipping_cost: number;
  down_payment_amount: number;
  remaining_amount: number;
  shipping_type: QuoteShippingType;
  shipping_region?: string | null;
  shipping_min_value?: number | null;
  shipping_description: string;
  notes?: string | null;
  items: QuoteItemResponse[];
  subtotal_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteListItemResponse {
  id: number;
  quote_number: string;
  customer: QuoteCustomerResponse;
  status: QuoteStatus;
  valid_until: string;
  total_amount: number;
  down_payment_percentage: number;
  down_payment_amount: number;
  shipping_description: string;
  created_at: string;
}

export interface QuoteListResponse {
  items: QuoteListItemResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
