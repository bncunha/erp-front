import { PaymentEnum } from '../../enums/payment.enum';
import { CreateSalePaymentsFormData } from '../../pages/sales-form/sales-payment-form/form.facotry';
import { CreateSaleProductsFormData } from '../../pages/sales-form/sales-products-form/form.factory';
import { cleanNulls } from '../../shared/utils/clean-nulls';
import { DateUtils } from '../../shared/utils/date.utils';

export class CreateSaleRequest {
  customer_id!: number;
  items!: CreateSaleItemRequest[];
  payments!: CreateSalePaymentRequest[];

  parseToRequest(
    payments: CreateSalePaymentsFormData[],
    formData: CreateSaleProductsFormData
  ): CreateSaleRequest {
    this.customer_id = formData.customer;
    this.items = formData.products.map((item) =>
      new CreateSaleItemRequest().parseToRequest(item)
    );
    this.payments = payments.map((payment) =>
      new CreateSalePaymentRequest().parseToRequest(payment)
    );
    return this;
  }
}

export class CreateSaleItemRequest {
  sku_id!: number;
  quantity!: number;

  parseToRequest(formData: CreateSaleProductsFormData): CreateSaleItemRequest {
    this.sku_id = formData.id;
    this.quantity = formData.quantity;
    return this;
  }
}

export class CreateSalePaymentRequest {
  payment_type!: string;
  value!: number;
  installments_quantity?: number;
  first_installment_date?: Date;

  parseToRequest(
    formData: CreateSalePaymentsFormData
  ): CreateSalePaymentRequest {
    Object.assign(this, formData);
    return this;
  }
}

export class UpdatePaymentStatusRequest {
  status!: PaymentEnum;
  date?: string;

  parseToRequest(formData: any): UpdatePaymentStatusRequest {
    Object.assign(this, formData);
    this.date = DateUtils.formatDateTime(formData.date);
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
