import { inject, Injectable } from '@angular/core';
import {
  GetInventoryItemsResponse,
  GetInventoryResponse,
} from '../../../service/responses/inventory-response';
import { BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { SelectChangeEvent } from 'primeng/select';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { DoIventoryTransationRequest } from '../../../service/requests/inventory-request';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { FormUtil } from '../../../shared/utils/form.utils';

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

  createForm() {
    return new FormBuilder().group({
      type: [null, [Validators.required]],
      inventory_origin_id: [null, [Validators.required]],
      inventory_destination_id: [null, [Validators.required]],
      justification: [null, [Validators.max(200)]],
      skus: new FormBuilder().array([]),
    });
  }

  addSku(form: FormGroup) {
    const control = new FormBuilder().group({
      sku_id: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
    });
    const skuArray = form.get('skus') as FormArray;
    skuArray.push(control);
  }

  removeSku(form: FormGroup, index: number) {
    const skuArray = form.get('skus') as FormArray;
    skuArray.removeAt(index);
  }

  enableOrigin(form: FormGroup, enabled: boolean) {
    if (enabled) {
      form.get('inventory_origin_id')?.enable();
    } else {
      form.get('inventory_origin_id')?.disable();
    }
  }

  enableDestination(form: FormGroup, enabled: boolean) {
    if (enabled) {
      form.get('inventory_destination_id')?.enable();
    } else {
      form.get('inventory_destination_id')?.disable();
    }
  }

  getSkus(form: FormGroup): FormArray {
    return form.get('skus') as FormArray;
  }

  resetForm(f: FormGroup) {
    f.reset();
    new FormUtil().zerarFormArray(f.get('skus') as FormArray);
    this.addSku(f);
    this.enableOrigin(f, false);
    this.enableDestination(f, false);
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

  onTypeChange(event: RadioButtonClickEvent, f: FormGroup) {
    f.get('inventory_origin_id')?.setValue(null);
    f.get('inventory_destination_id')?.setValue(null);
    f.get('sku_id')?.setValue(null);
    this.productsSubject.next([]);
    if (event.value === 'IN') {
      this.enableOrigin(f, false);
      this.enableDestination(f, true);
      this.fetchAllProducts();
    } else if (event.value === 'OUT') {
      this.enableOrigin(f, true);
      this.enableDestination(f, false);
    } else {
      this.enableOrigin(f, true);
      this.enableDestination(f, true);
    }
  }

  fetchAllProducts() {
    this.skuApiService.getAll().subscribe((response) => {
      const products: GetInventoryItemsResponse[] = response.map((item) => {
        return {
          inventory_item_id: item.id,
          sku_id: item.id,
          sku_code: item.code,
          product_name: `(${item.code}) ${item.name}`,
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
        this.productsSubject.next(
          response.map((item) => {
            return {
              ...item,
              product_name: `(${item.sku_code}) ${item.product_name}`,
            };
          })
        );
      });
  }

  onOriginChange(event: SelectChangeEvent) {
    this.productsSubject.next([]);
    this.fetchOriginProducts(event.value);
  }

  handleSubmit(f: FormGroup): Observable<void> {
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
