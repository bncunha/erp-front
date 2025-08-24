import { inject, Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { GetTransactionHistoryResponse } from '../../../service/responses/inventory-response';
import { ThemeService } from '../../../service/theme.service';

@Injectable()
export class InventoryHistoryService {
  private reloadSubject = new BehaviorSubject<void>(undefined);

  private inventoryApiService = inject(InventoryApiService);
  private themeService = inject(ThemeService);

  getHistory(): Observable<GetTransactionHistoryResponse[]> {
    return this.reloadSubject.pipe(
      switchMap(() => this.inventoryApiService.getTransactionsHistory())
    );
  }

  getColumns(): Column[] {
    return [
      {
        header: 'Data',
        field: 'date',
      },
      {
        header: 'Tipo',
        field: 'type',
        styleFn: (item) => {
          const style = { 'font-weight': 'bold' };
          switch (item.type) {
            case 'Entrada':
              return {
                ...style,
                color: this.themeService.getStyle('--p-emerald-500'),
              };
            case 'Saída':
              return {
                ...style,
                color: this.themeService.getStyle('--p-red-500'),
              };
            case 'Transferência':
              return {
                ...style,
                color: this.themeService.getStyle('--p-blue-500'),
              };
          }
          return style;
        },
      },
      {
        header: 'Produto',
        field: 'product_name',
      },
      {
        header: 'Quantidade',
        field: 'quantity',
      },
      {
        header: 'Origem',
        field: 'origin',
      },
      {
        header: 'Destino',
        field: 'destination',
      },
      {
        header: 'Motivo',
        field: 'justification',
      },
    ];
  }
}
