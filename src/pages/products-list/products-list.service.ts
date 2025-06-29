import { Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';

@Injectable()
export class ProductsListService {
  getColumns(): Column[] {
    return [
      {
        header: 'Nome',
        field: 'name',
      },
      {
        header: 'Categoria',
        field: 'category',
      },
      {
        header: 'Qtd. estoque',
        field: 'inventory_qtd',
      },
    ];
  }
}
