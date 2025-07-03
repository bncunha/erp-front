import { Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';

@Injectable()
export class InventoryHistoryService {
  getColumns(): Column[] {
    return [
      {
        header: 'Data',
        field: 'date',
      },
      {
        header: 'Tipo',
        field: 'type',
      },
      {
        header: 'Produto',
        field: 'product',
      },
      {
        header: 'Quantidade',
        field: 'quantity',
      },
      {
        header: 'Origem',
        field: 'source',
      },
      {
        header: 'Destino',
        field: 'destination',
      },
    ];
  }
}
