import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, take, tap } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { GetSkuResponse } from '../../../service/responses/products-response';
import { InventoryTypeEnum } from '../../../enums/inventory-type.enum';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { DoIventoryTransationRequest } from '../../../service/requests/inventory-request';

export interface InventoryFormDialogMultipleOptions {
  inventoryId: number;
  inventoryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryFormDialogMultipleService {
  private inventoryApiService = inject(InventoryApiService);
  private skuApiService = inject(SkuApiService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  private skuOptionsSubject = new BehaviorSubject<GetSkuResponse[]>([]);
  readonly skuOptions$ = this.skuOptionsSubject.asObservable();

  private inventoryQuantities = new Map<number, number>();
  private inventoryId: number | null = null;

  createForm(): FormGroup {
    return this.formBuilder.group({
      type: [InventoryTypeEnum.IN, [Validators.required]],
      inventory_destination_id: [null, [Validators.required]],
      justification: [null, [Validators.maxLength(200)]],
      skus: this.formBuilder.array([this.createSkuGroup()]),
    });
  }

  open(form: FormGroup, options: InventoryFormDialogMultipleOptions) {
    this.resetForm(form);
    this.inventoryId = options.inventoryId;
    this.inventoryQuantities = new Map();
    form.get('inventory_destination_id')?.setValue(options.inventoryId);
    form.get('type')?.setValue(InventoryTypeEnum.IN);

    this.loadSkuOptions();
    this.loadInventoryQuantities(options.inventoryId);
  }

  addProductControl(form: FormGroup) {
    const controls = this.getProductsArray(form);
    controls.push(this.createSkuGroup());
  }

  removeProductControl(form: FormGroup, index: number) {
    const controls = this.getProductsArray(form);
    if (controls.length <= 1) {
      return;
    }

    controls.removeAt(index);
  }

  getProductsArray(form: FormGroup): FormArray {
    return form.get('skus') as FormArray;
  }

  getSkuControls(form: FormGroup): FormGroup[] {
    return this.getProductsArray(form).controls as FormGroup[];
  }

  getAvailableSkus(form: FormGroup, index: number): GetSkuResponse[] {
    const selectedIds = this.getSelectedSkuIds(form, index);
    const controls = this.getSkuControls(form);
    const rawCurrent = controls[index]?.get('sku_id')?.value ?? null;
    const currentSkuId =
      typeof rawCurrent === 'string' ? Number(rawCurrent) : rawCurrent;
    return this.skuOptionsSubject.value.filter((sku) => {
      if (
        currentSkuId &&
        !Number.isNaN(currentSkuId) &&
        sku.id === currentSkuId
      ) {
        return true;
      }

      return !selectedIds.has(sku.id);
    });
  }

  getFormGroupByIndex(form: FormGroup, index: number): FormGroup {
    return this.getProductsArray(form).controls[index] as FormGroup;
  }

  getCurrentQuantityByIndex(form: FormGroup, index: number): number | null {
    const controls = this.getSkuControls(form);
    const skuId = controls[index]?.get('sku_id')?.value;
    console.log('Current Quantity', controls[index].value);
    if (skuId === null || skuId === undefined || skuId === '') {
      return null;
    }
    return this.getCurrentQuantity(skuId);
  }

  getProjectedQuantityByIndex(
    form: FormGroup,
    index: number
  ): number | null {
    const controls = this.getSkuControls(form);
    const skuId = controls[index]?.get('sku_id')?.value;
    const quantity = controls[index]?.get('quantity')?.value;

    if (
      skuId === null ||
      skuId === undefined ||
      skuId === '' ||
      quantity === null ||
      quantity === undefined
    ) {
      return null;
    }

    return this.calculateProjectedQuantity(skuId, quantity);
  }

  getCurrentQuantity(
    skuId: number | string | null | undefined
  ): number {
    if (skuId === null || skuId === undefined) {
      return 0;
    }
    const parsedId =
      typeof skuId === 'string' ? Number(skuId) : skuId;

    if (!parsedId || Number.isNaN(parsedId)) {
      return 0;
    }

    return this.inventoryQuantities.get(parsedId) ?? 0;
  }

  calculateProjectedQuantity(
    skuId: number | string | null | undefined,
    quantity: number | string | null | undefined
  ): number | null {
    const parsedId =
      typeof skuId === 'string' ? Number(skuId) : skuId;
    const parsedQuantity =
      typeof quantity === 'string' ? Number(quantity) : quantity;

    if (
      !parsedId ||
      Number.isNaN(parsedId) ||
      !parsedQuantity ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return null;
    }
    const current = this.getCurrentQuantity(parsedId);
    return current + parsedQuantity;
  }

  handleSubmit(form: FormGroup): Observable<void> {
    if (!this.inventoryId || form.invalid) {
      return EMPTY;
    }

    const raw = form.getRawValue();
    const request = new DoIventoryTransationRequest().parseToRequest({
      ...raw,
      type: InventoryTypeEnum.IN,
      inventory_destination_id: this.inventoryId,
      inventory_origin_id: null,
      skus: raw.skus,
    });

    return this.inventoryApiService
      .doTransaction(request)
      .pipe(
        take(1),
        tap(() =>
          this.toastService.showSuccess('Produtos adicionados com sucesso!')
        )
      );
  }

  private createSkuGroup(): FormGroup {
    return this.formBuilder.group({
      sku_id: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private resetForm(form: FormGroup) {
    const products = this.getProductsArray(form);
    while (products.length > 0) {
      products.removeAt(products.length - 1);
    }
    products.push(this.createSkuGroup());
    form.get('type')?.setValue(InventoryTypeEnum.IN);
    form.get('inventory_destination_id')?.reset();
    form.get('justification')?.reset();
    form.markAsPristine();
    form.markAsUntouched();
  }

  private getSelectedSkuIds(
    form: FormGroup,
    excludeIndex?: number
  ): Set<number> {
    const ids = new Set<number>();

    this.getSkuControls(form).forEach((control, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) {
        return;
      }

      const rawValue = control.get('sku_id')?.value;
      const parsedId =
        typeof rawValue === 'string' ? Number(rawValue) : rawValue;

      if (parsedId && !Number.isNaN(parsedId)) {
        ids.add(parsedId);
      }
    });

    return ids;
  }

  private loadSkuOptions() {
    this.skuApiService
      .getAll()
      .pipe(take(1))
      .subscribe({
        next: (skus) => this.skuOptionsSubject.next(skus),
        error: () => this.skuOptionsSubject.next([]),
      });
  }

  private loadInventoryQuantities(inventoryId: number) {
    this.inventoryApiService
      .getProductsByInventory(inventoryId)
      .pipe(take(1))
      .subscribe({
        next: (items) => {
          this.inventoryQuantities = new Map(
            items.map((item) => [item.sku_id, item.quantity])
          );
        },
        error: () => {
          this.inventoryQuantities = new Map();
        },
      });
  }
}
