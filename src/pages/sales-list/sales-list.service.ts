import { inject, Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { SalesApiService } from '../../service/api-service/sales-api.service';
import { GetAllSalesResponse } from '../../service/responses/sales-response';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { GetPaymentColor, GetPaymentName } from '../../enums/payment.enum';
import { ActivatedRoute } from '@angular/router';
import { GetAllSalesRequest } from '../../service/requests/sales-request';

@Injectable()
export class SalesListService {
  private reloadSubject = new BehaviorSubject<void>(undefined);

  private salesApiService = inject(SalesApiService);
  private datePipe = inject(DatePipe);
  private currencyPipe = inject(CurrencyPipe);

  initPage() {
    sessionStorage.setItem('sales_products_form', '');
  }

  getAll(params: any): Observable<GetAllSalesResponse> {
    const filters = new GetAllSalesRequest().parseToRequest(params);
    return this.reloadSubject.pipe(
      switchMap(() => this.salesApiService.getAll(filters))
    );
  }

  getColumns(): Column[] {
    return [
      {
        header: 'Data',
        field: 'date',
        valueFn: (item) => {
          return this.datePipe.transform(item.date, 'short') as string;
        },
      },
      {
        header: 'Vendedor',
        field: 'seller_name',
      },
      {
        header: 'Cliente',
        field: 'customer_name',
      },
      {
        header: 'Total (R$)',
        field: 'total_value',
        valueFn: (item) => {
          return this.currencyPipe.transform(item.total_value, 'BRL') as any;
        },
      },
      {
        header: 'Qtd. itens',
        field: 'total_items',
      },
      {
        header: 'Situação',
        field: 'status',
        styleFn: (item) => {
          return {
            color: GetPaymentColor(item.status),
            fontWeight: 'bold',
          };
        },
        valueFn: (item) => {
          return GetPaymentName(item.status);
        },
      },
    ];
  }
}
