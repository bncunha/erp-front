import { Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';

@Injectable()
export class InventoryListService {
  getColums(): Column[] {
    return [
      {
        header: 'Produto',
        field: 'product',
      },
      {
        header: 'Local',
        field: 'inventory',
      },
      {
        header: 'Quantidade',
        field: 'quantity',
      },
    ];
  }
}
