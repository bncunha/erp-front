import { Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';

@Injectable()
export class SalesDetailsService {
  visible: boolean = false;

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
        field: 'unitPrice',
      },
      {
        header: 'Valor Total',
        field: 'total',
      },
    ];
  }
}
