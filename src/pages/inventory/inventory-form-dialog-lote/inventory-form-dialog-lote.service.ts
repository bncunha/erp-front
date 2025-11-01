import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  map,
  take,
  tap,
} from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import {
  GetInventoryItemsResponse,
  GetInventoryResponse,
} from '../../../service/responses/inventory-response';
import { InventoryTypeEnum } from '../../../enums/inventory-type.enum';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { DoIventoryTransationRequest } from '../../../service/requests/inventory-request';

export interface InventoryFormDialogLoteOptions {
  type: InventoryTypeEnum;
  inventoryId: number;
  inventoryName: string;
  products: GetInventoryItemsResponse[];
}

@Injectable()
export class InventoryFormDialogLoteService {
  private inventoryApiService = inject(InventoryApiService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  private inventoriesSubject = new BehaviorSubject<GetInventoryResponse[]>([]);
  private destinationQuantities = new Map<number, number>();
  private transactionType: InventoryTypeEnum = InventoryTypeEnum.OUT;
  private inventoryId: number | null = null;

  createForm(): FormGroup {
    return this.formBuilder.group({
      type: [InventoryTypeEnum.OUT, [Validators.required]],
      inventory_origin_id: [null],
      inventory_destination_id: [null],
      justification: [null, [Validators.maxLength(200)]],
      skus: this.formBuilder.array([]),
    });
  }

  open(form: FormGroup, options: InventoryFormDialogLoteOptions) {
    this.resetForm(form);

    this.transactionType = options.type;
    this.inventoryId = options.inventoryId;

    form.get('type')?.setValue(this.transactionType);
    form.get('inventory_origin_id')?.setValue(options.inventoryId);

    if (this.transactionType === InventoryTypeEnum.TRANSFER) {
      form
        .get('inventory_destination_id')
        ?.setValidators([Validators.required]);
      form.get('inventory_destination_id')?.setValue(null);
    } else {
      form.get('inventory_destination_id')?.clearValidators();
      form.get('inventory_destination_id')?.setValue(null);
    }
    form.get('inventory_destination_id')?.updateValueAndValidity({
      emitEvent: false,
    });

    const skuArray = this.getSkuArray(form);
    options.products.forEach((product) => {
      skuArray.push(this.createSkuGroup(product));
    });

    this.fetchInventories();
  }

  handleDestinationChange(destinationId: number | null, form: FormGroup) {
    if (
      destinationId === null ||
      this.transactionType !== InventoryTypeEnum.TRANSFER
    ) {
      this.destinationQuantities = new Map();
      return;
    }

    this.inventoryApiService
      .getProductsByInventory(destinationId)
      .pipe(take(1))
      .subscribe({
        next: (items) => {
          this.destinationQuantities = new Map(
            items.map((item) => [item.sku_id, item.quantity])
          );
          this.refreshProjectedQuantities(form);
        },
        error: () => {
          this.destinationQuantities = new Map();
        },
      });
  }

  getSkuControls(form: FormGroup): FormGroup[] {
    return this.getSkuArray(form).controls as FormGroup[];
  }

  removeProductControl(form: FormGroup, index: number) {
    const controls = this.getSkuArray(form);
    if (index < 0 || index >= controls.length || controls.length <= 1) {
      return;
    }
    controls.removeAt(index);
  }

  getDestinationInventories(): Observable<GetInventoryResponse[]> {
    return this.inventoriesSubject.asObservable().pipe(
      map((inventories) =>
        inventories.filter((inventory) => inventory.id !== this.inventoryId)
      )
    );
  }

  getTransactionType(): InventoryTypeEnum {
    return this.transactionType;
  }

  getDestinationCurrentQuantity(skuId: number): number {
    if (this.transactionType !== InventoryTypeEnum.TRANSFER) {
      return 0;
    }
    return this.destinationQuantities.get(skuId) ?? 0;
  }

  getDestinationProjectedQuantity(control: FormGroup): number | null {
    if (this.transactionType !== InventoryTypeEnum.TRANSFER) {
      return null;
    }
    const skuId = Number(control.get('sku_id')?.value ?? 0);
    const quantity = Number(control.get('quantity')?.value ?? 0);

    if (!skuId || quantity <= 0) {
      return this.getDestinationCurrentQuantity(skuId);
    }

    const current = this.getDestinationCurrentQuantity(skuId);
    return current + quantity;
  }

  getOriginProjectedQuantity(control: FormGroup): number {
    const available = Number(control.get('available_quantity')?.value ?? 0);
    const quantity = Number(control.get('quantity')?.value ?? 0);

    if (this.transactionType === InventoryTypeEnum.IN) {
      return available + Math.max(quantity, 0);
    }

    return Math.max(available - quantity, 0);
  }

  handleSubmit(form: FormGroup): Observable<void> {
    if (!this.inventoryId || form.invalid) {
      return EMPTY;
    }

    const raw = form.getRawValue();
    const payload = {
      ...raw,
      type: this.transactionType,
      inventory_origin_id: this.inventoryId,
      inventory_destination_id:
        this.transactionType === InventoryTypeEnum.IN ? this.inventoryId :
        this.transactionType === InventoryTypeEnum.TRANSFER
          ? raw.inventory_destination_id
          : null,
    };

    if (
      this.transactionType === InventoryTypeEnum.TRANSFER &&
      !payload.inventory_destination_id
    ) {
      return EMPTY;
    }

    const request = new DoIventoryTransationRequest().parseToRequest(payload);

    return this.inventoryApiService.doTransaction(request).pipe(
      take(1),
      tap(() =>
        this.toastService.showSuccess(
          'Movimentação em lote realizada com sucesso!'
        )
      )
    );
  }

  private getSkuArray(form: FormGroup): FormArray {
    return form.get('skus') as FormArray;
  }

  private createSkuGroup(product: GetInventoryItemsResponse): FormGroup {
    const isEntry = this.transactionType === InventoryTypeEnum.IN;
    const validators = [Validators.required, Validators.min(1)];

    if (!isEntry) {
      validators.push(Validators.max(product.quantity));
    }

    const initialQuantity = isEntry
      ? 1
      : Math.min(product.quantity, 1) || 1;

    return this.formBuilder.group({
      sku_id: [product.sku_id, [Validators.required]],
      product_name: [product.product_name],
      sku_code: [product.sku_code],
      available_quantity: [product.quantity],
      quantity: [initialQuantity, validators],
    });
  }

  private resetForm(form: FormGroup) {
    form.reset();
    const skuArray = this.getSkuArray(form);
    while (skuArray.length > 0) {
      skuArray.removeAt(skuArray.length - 1);
    }
    this.destinationQuantities = new Map();
    this.inventoriesSubject.next([]);
  }

  private fetchInventories() {
    this.inventoryApiService
      .getAll()
      .pipe(take(1))
      .subscribe({
        next: (inventories) => this.inventoriesSubject.next(inventories),
        error: () => this.inventoriesSubject.next([]),
      });
  }

  private refreshProjectedQuantities(form: FormGroup) {
    this.getSkuControls(form).forEach((control) => {
      control.get('quantity')?.updateValueAndValidity({ emitEvent: false });
    });
  }
}
