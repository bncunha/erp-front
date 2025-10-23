import { inject, Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';
import { Observable, of } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { GetTransactionHistoryResponse } from '../../../service/responses/inventory-response';
import { ThemeService } from '../../../service/theme.service';

@Injectable()
export class InventoryHistoryService {
  private inventoryApiService = inject(InventoryApiService);
  private themeService = inject(ThemeService);

  private inventoryId: number | null = null;

  getHistory(
    inventoryId: number | null
  ): Observable<GetTransactionHistoryResponse[]> {
    this.inventoryId = inventoryId;

    if (inventoryId === null) {
      return of([]);
    }

    return this.inventoryApiService.getTransactionsHistory(inventoryId);
  }

  reload(): Observable<GetTransactionHistoryResponse[]> {
    if (this.inventoryId === null) {
      return of([]);
    }

    return this.inventoryApiService.getTransactionsHistory(this.inventoryId);
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
