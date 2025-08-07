import { inject, Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';
import { CurrencyPipe } from '@angular/common';

@Injectable()
export class SkuListService {
  private currencyPipe = inject(CurrencyPipe);

  getColumns(): Column[] {
    return [
      {
        header: 'ID',
        field: 'id',
      },
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
        valueFn: (item) => {
          return this.currencyPipe.transform(item.cost, 'BRL') || '';
        },
      },
      {
        header: 'Preço',
        field: 'price',
        valueFn: (item) => {
          return this.currencyPipe.transform(item.price, 'BRL') || '';
        },
      },
      {
        header: 'Qtd.',
        field: 'inventory_qtd',
      },
    ];
  }
}
