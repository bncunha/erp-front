import { inject, Injectable } from '@angular/core';
import {
  GetInventoryItemsResponse,
  GetInventoryResponse,
} from '../../../service/responses/inventory-response';
import { BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { SelectChangeEvent } from 'primeng/select';
import { NgForm } from '@angular/forms';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { DoIventoryTransationRequest } from '../../../service/requests/inventory-request';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryFormDialogService {
  private inventoriesSubject = new BehaviorSubject<GetInventoryResponse[]>([]);
  private productsSubject = new BehaviorSubject<GetInventoryItemsResponse[]>(
    []
  );

  private inventoryApiService = inject(InventoryApiService);
  private skuApiService = inject(SkuApiService);
  private toastService = inject(ToastService);

  isOriginEnabled = false;
  isDestinationEnabled = false;

  resetForm(f: NgForm) {
    f.resetForm();
    this.isOriginEnabled = false;
    this.isDestinationEnabled = false;
    this.inventoriesSubject.next([]);
    this.productsSubject.next([]);
  }

  getProductsSubject(): Observable<GetInventoryItemsResponse[]> {
    return this.productsSubject;
  }

  getInventoriesSubject(): Observable<GetInventoryResponse[]> {
    return this.inventoriesSubject;
  }

  fetchInventories() {
    this.inventoryApiService.getAll().subscribe((response) => {
      this.inventoriesSubject.next(response);
    });
  }

  onTypeChange(event: RadioButtonClickEvent, f: NgForm) {
    f.form.get('inventory_origin_id')?.setValue(null);
    f.form.get('inventory_destination_id')?.setValue(null);
    f.form.get('sku_id')?.setValue(null);
    this.productsSubject.next([]);
    if (event.value === 'IN') {
      this.isOriginEnabled = false;
      this.isDestinationEnabled = true;
      this.fetchAllProducts();
    } else if (event.value === 'OUT') {
      this.isOriginEnabled = true;
      this.isDestinationEnabled = false;
    } else {
      this.isOriginEnabled = true;
      this.isDestinationEnabled = true;
    }
  }

  fetchAllProducts() {
    this.skuApiService.getAll().subscribe((response) => {
      const products: GetInventoryItemsResponse[] = response.map((item) => {
        return {
          inventory_item_id: item.id,
          sku_id: item.id,
          sku_code: item.code,
          product_name: item.name,
          inventory_type: '-',
          user_name: '-',
          quantity: item.quantity,
        };
      });
      this.productsSubject.next(products);
    });
  }

  fetchOriginProducts(originId: number) {
    this.productsSubject.next([]);
    this.inventoryApiService
      .getProductsByInventory(originId!)
      .subscribe((response) => {
        this.productsSubject.next(response);
      });
  }

  onOriginChange(event: SelectChangeEvent) {
    this.productsSubject.next([]);
    this.fetchOriginProducts(event.value);
  }

  handleSubmit(f: NgForm): Observable<void> {
    if (f.valid) {
      const request = new DoIventoryTransationRequest().parseToRequest(f.value);
      return this.inventoryApiService.doTransaction(request).pipe(
        tap(() => {
          this.toastService.showSuccess('Movimento realizado com sucesso!');
        })
      );
    }
    return EMPTY;
  }
}
