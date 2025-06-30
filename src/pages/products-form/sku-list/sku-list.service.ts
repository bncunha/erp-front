import { Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';

@Injectable()
export class SkuListService {
  getColumns(): Column[] {
    return [
      {
        header: 'Código',
        field: 'code',
      },
      {
        header: 'Cor',
        field: 'color',
      },
      {
        header: 'Tamanho',
        field: 'size',
      },
      {
        header: 'Custo',
        field: 'cost',
      },
      {
        header: 'Preço',
        field: 'price',
      },
      {
        header: 'Qtd.',
        field: 'inventory_qtd',
      },
    ];
  }
}
