import { PaymentEnum } from '../../enums/payment.enum';
import { cleanNulls } from '../../shared/utils/clean-nulls';

export class CreateSaleRequest {
  customer_id!: number;
  items!: CreateSaleItemRequest[];
  payments!: CreateSalePaymentRequest[];

  parseToRequest(formData: any): CreateSaleRequest {
    Object.assign(this, formData);
    this.items = this.items.map((item) => item.parseToRequest(formData.items));
    this.payments = this.payments.map((payment) =>
      payment.parseToRequest(formData.payments)
    );
    return this;
  }
}

export class CreateSaleItemRequest {
  sku_id!: number;
  quantity!: number;

  parseToRequest(formData: any): CreateSaleItemRequest {
    Object.assign(this, formData);
    return this;
  }
}

export class CreateSalePaymentRequest {
  payment_type!: string;
  dates!: CreateSalePaymentDateRequest[];

  parseToRequest(formData: any): CreateSalePaymentRequest {
    Object.assign(this, formData);
    this.dates = this.dates.map((date) => date.parseToRequest(formData.dates));
    return this;
  }
}

export class CreateSalePaymentDateRequest {
  date!: string;
  installment_value!: number;

  parseToRequest(formData: any): CreateSalePaymentDateRequest {
    Object.assign(this, formData);
    return this;
  }
}

export class UpdatePaymentStatusRequest {
  status!: PaymentEnum;
  date!: Date;

  parseToRequest(formData: any): UpdatePaymentStatusRequest {
    Object.assign(this, formData);
    return this;
  }
}

export class GetAllSalesRequest {
  min_date?: Date;
  max_date?: Date;
  user_id?: number;
  customer_id?: number;
  payment_status?: PaymentEnum;

  parseToRequest(formData: any): GetAllSalesRequest {
    Object.assign(this, formData);
    return cleanNulls(this);
  }
}
