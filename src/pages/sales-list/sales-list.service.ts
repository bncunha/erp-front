import { Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';

@Injectable()
export class SalesListService {
  getColumns(): Column[] {
    return [
      {
        header: 'Data',
        field: 'date',
      },
      {
        header: 'Vendedor',
        field: 'saler',
      },
      {
        header: 'Cliente',
        field: 'customer',
      },
      {
        header: 'Total (R$)',
        field: 'total_value',
      },
      {
        header: 'Pagamento',
        field: 'payment_plan',
      },
      {
        header: 'Situação',
        field: 'status',
      },
    ];
  }
}
