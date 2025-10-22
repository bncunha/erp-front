import { inject, Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';
import { SalesApiService } from '../../../service/api-service/sales-api.service';
import { finalize, Observable } from 'rxjs';
import { GetSaleResponse } from '../../../service/responses/sales-response';
import {
  GetPaymentTypeNmae,
  PaymentTypeEnum,
} from '../../../enums/payment-type.enum';
import { CurrencyPipe } from '@angular/common';

@Injectable()
export class SalesDetailsService {
  private salesApiService = inject(SalesApiService);
  private currencyPipe = inject(CurrencyPipe);

  loading: boolean = false;
  visible: boolean = false;

  getPaymentType(paymentType: PaymentTypeEnum): string {
    return GetPaymentTypeNmae(paymentType);
  }

  getSale(id: number): Observable<GetSaleResponse> {
    this.loading = true;
    return this.salesApiService
      .getById(id)
      .pipe(finalize(() => (this.loading = false)));
  }

  toggle() {
    this.visible = !this.visible;
  }

  getItensColumns(): Column[] {
    return [
      {
        header: 'Código',
        field: 'code',
      },
      {
        header: 'Descrição',
        field: 'description',
      },
      {
        header: 'Quantidade',
        field: 'quantity',
      },
      {
        header: 'Preço Unitário',
        field: 'unit_price',
        valueFn: (item) => {
          return this.currencyPipe.transform(item.unit_price, 'BRL') as any;
        },
      },
      {
        header: 'Valor Total',
        field: 'total_value',
        valueFn: (item) => {
          return this.currencyPipe.transform(item.total_value, 'BRL') as any;
        },
      },
    ];
  }
}
