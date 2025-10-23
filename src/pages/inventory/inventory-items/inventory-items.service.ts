import { inject, Injectable } from '@angular/core';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { GetInventoryItemsResponse } from '../../../service/responses/inventory-response';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class InventoryItemsService {
  private inventoryApiService = inject(InventoryApiService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private itemsSubject = new BehaviorSubject<GetInventoryItemsResponse[]>([]);
  private currentInventoryId: number | null = null;

  readonly isLoading$ = this.loadingSubject.asObservable();
  readonly items$: Observable<GetInventoryItemsResponse[]> =
    this.itemsSubject.asObservable();

  setInventoryId(inventoryId: number | null) {
    if (inventoryId === this.currentInventoryId) {
      return;
    }

    this.currentInventoryId = inventoryId;

    if (inventoryId === null) {
      this.itemsSubject.next([]);
      return;
    }

    this.fetchItems();
  }

  reload() {
    if (this.currentInventoryId === null) {
      return;
    }

    this.fetchItems();
  }

  private fetchItems() {
    if (this.currentInventoryId === null) {
      this.itemsSubject.next([]);
      return;
    }

    this.loadingSubject.next(true);
    this.inventoryApiService
      .getProductsByInventory(this.currentInventoryId)
      .subscribe({
        next: (items) => {
          this.itemsSubject.next(items);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.itemsSubject.next([]);
          this.loadingSubject.next(false);
        },
      });
  }
}
