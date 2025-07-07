import { Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';

@Injectable()
export class ItemsListService {
  getColumns(): Column[] {
    return [
      {
        header: 'Produto',
        field: 'product',
      },
      {
        header: 'Quantidade',
        field: 'quantity',
      },
      {
        header: 'Vl. Unitário',
        field: 'unit_value',
      },
      {
        header: 'Vl. Total',
        field: 'total_value',
      },
    ];
  }
}
