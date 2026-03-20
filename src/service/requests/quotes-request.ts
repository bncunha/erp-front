import { cleanNulls } from '../../shared/utils/clean-nulls';
import { QuoteShippingType, QuoteStatus } from '../responses/quotes-response';

export interface QuoteItemRequest {
  sku_id: number;
  quantity: number;
  unit_price: number;
}

export class UpsertQuoteRequest {
  customer_id!: number;
  valid_until!: string;
  down_payment_percentage!: number;
  discount_percentage!: number;
  shipping_type!: QuoteShippingType;
  shipping_cost!: number;
  shipping_region?: string | null;
  shipping_min_value?: number | null;
  notes?: string | null;
  items!: QuoteItemRequest[];

  parseToRequest(formValue: any): UpsertQuoteRequest {
    this.customer_id = Number(formValue.customer_id);
    this.valid_until = formValue.valid_until;
    this.down_payment_percentage = Number(formValue.down_payment_percentage);
    this.discount_percentage = Number(formValue.discount_percentage ?? 0);
    this.shipping_type = formValue.shipping_type;
    this.shipping_cost = Number(formValue.shipping_cost ?? 0);
    this.shipping_region = formValue.shipping_region || null;
    this.shipping_min_value =
      formValue.shipping_min_value !== null &&
      formValue.shipping_min_value !== undefined
        ? Number(formValue.shipping_min_value)
        : null;
    this.notes = formValue.notes || null;
    this.items = (formValue.items || []).map((item: any) => ({
      sku_id: Number(item.sku_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }));
    return cleanNulls(this) as UpsertQuoteRequest;
  }
}

export class PatchQuoteStatusRequest {
  status!: QuoteStatus;
}

export class GetQuotesRequest {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: string;
  status?: QuoteStatus[];
  customer_id?: number;
  valid_until_start?: string;
  valid_until_end?: string;
  created_at_start?: string;
  created_at_end?: string;
  search?: string;
  only_expired?: boolean;

  parseToRequest(value: any): GetQuotesRequest {
    Object.assign(this, value);
    return cleanNulls(this) as GetQuotesRequest;
  }
}
