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
        header: 'Quantidade',
        field: 'quantity',
      },
      {
        header: 'Valor Total',
        field: 'total_value',
      },
      {
        header: 'Parcelamento',
        field: 'installment_plan',
      },
    ];
  }
}
