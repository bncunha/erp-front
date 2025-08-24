import { inject, Injectable } from '@angular/core';
import { Column } from '../../../shared/components/table/models/column';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { GetInventoryItemsResponse } from '../../../service/responses/inventory-response';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable()
export class InventoryListService {
  private reloadSubject = new BehaviorSubject<void>(undefined);
  private inventoryApiService = inject(InventoryApiService);

  getAllItems(): Observable<GetInventoryItemsResponse[]> {
    return this.reloadSubject.pipe(
      switchMap(() => this.inventoryApiService.getAllItems())
    );
  }

  getColums(): Column[] {
    return [
      {
        header: 'Código',
        field: 'sku_code',
      },
      {
        header: 'Produto',
        field: 'product_name',
      },
      {
        header: 'Local',
        field: 'item.user_name',
        valueFn: (item) => {
          if (item.user_name) {
            return item.user_name + ' - ' + item.inventory_type;
          }
          return item.inventory_type;
        },
      },
      {
        header: 'Quantidade',
        field: 'quantity',
      },
    ];
  }

  reload() {
    this.reloadSubject.next();
  }
}
