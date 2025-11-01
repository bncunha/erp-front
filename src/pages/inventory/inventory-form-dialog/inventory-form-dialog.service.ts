import { inject, Injectable } from '@angular/core';
import {
  GetInventoryItemsResponse,
  GetInventoryResponse,
} from '../../../service/responses/inventory-response';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoIventoryTransationRequest } from '../../../service/requests/inventory-request';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { InventoryTypeEnum } from '../../../enums/inventory-type.enum';

export interface InventoryFormDialogOptions {
  type?: InventoryTypeEnum;
  inventoryId?: number;
  product?: GetInventoryItemsResponse;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryFormDialogService {
  private inventoriesSubject = new BehaviorSubject<GetInventoryResponse[]>([]);
  private transactionType: InventoryTypeEnum | null = null;
  private selectedProduct: GetInventoryItemsResponse | null = null;
  private currentInventoryId: number | null = null;
  private destinationInventoryId: number | null = null;
  private destinationCurrentQuantity: number | null = null;
  private currentInventoryProjectedQuantity: number | null = null;
  private destinationProjectedQuantity: number | null = null;

  private inventoryApiService = inject(InventoryApiService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  createForm() {
    return this.formBuilder.group({
      type: [null, [Validators.required]],
      inventory_origin_id: [null],
      inventory_destination_id: [null],
      sku_id: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      justification: [null, [Validators.maxLength(200)]],
    });
  }

  resetForm(f: FormGroup) {
    f.reset();
    this.inventoriesSubject.next([]);
    this.transactionType = null;
    this.selectedProduct = null;
    this.currentInventoryId = null;
    this.destinationInventoryId = null;
    this.resetCalculatedQuantities();
  }

  open(form: FormGroup, options?: InventoryFormDialogOptions) {
    this.resetForm(form);
    this.fetchInventories();

    this.transactionType = options?.type ?? null;
    this.selectedProduct = options?.product ?? null;
    this.currentInventoryId = options?.inventoryId ?? null;

    if (this.transactionType) {
      this.setTransactionType(this.transactionType, form);
      form.get('type')?.setValue(this.transactionType);
    }

    if (this.selectedProduct) {
      form.get('sku_id')?.setValue(this.selectedProduct.sku_id);
    }

    if (this.currentInventoryId !== null && this.transactionType) {
      if (this.transactionType === InventoryTypeEnum.IN) {
        form.get('inventory_destination_id')?.setValue(this.currentInventoryId);
        form.get('inventory_origin_id')?.setValue(null);
        this.destinationInventoryId = this.currentInventoryId;
      } else if (this.transactionType === InventoryTypeEnum.OUT) {
        form.get('inventory_origin_id')?.setValue(this.currentInventoryId);
        form.get('inventory_destination_id')?.setValue(null);
        this.destinationInventoryId = null;
      } else if (this.transactionType === InventoryTypeEnum.TRANSFER) {
        form.get('inventory_origin_id')?.setValue(this.currentInventoryId);
        form.get('inventory_destination_id')?.setValue(null);
        this.destinationInventoryId = null;
      }
    }

    if (this.transactionType === InventoryTypeEnum.TRANSFER) {
      this.destinationCurrentQuantity = null;
    }

    this.updateProjectedQuantities(form);
  }

  getInventoriesSubject(): Observable<GetInventoryResponse[]> {
    return this.inventoriesSubject;
  }

  getDestinationInventories(): Observable<GetInventoryResponse[]> {
    return this.inventoriesSubject.pipe(
      map((inventories) =>
        inventories.filter(
          (inventory) => inventory.id !== this.currentInventoryId
        )
      )
    );
  }

  fetchInventories() {
    this.inventoryApiService.getAll().subscribe((response) => {
      this.inventoriesSubject.next(response);
    });
  }

  setTransactionType(type: InventoryTypeEnum, f: FormGroup) {
    f.get('type')?.setValue(type);
    f.get('inventory_origin_id')?.setValue(null);
    f.get('inventory_destination_id')?.setValue(null);

    if (type === 'TRANSFER') {
      f
        .get('inventory_destination_id')
        ?.setValidators([Validators.required]);
    } else {
      f.get('inventory_destination_id')?.clearValidators();
    }
    f.get('inventory_destination_id')?.updateValueAndValidity({
      emitEvent: false,
    });
  }

  fetchProductQuantity(inventoryId: number, skuId: number): Observable<number> {
    return this.inventoryApiService.getProductsByInventory(inventoryId).pipe(
      map(
        (items) =>
          items.find((item) => item.sku_id === skuId)?.quantity ?? 0
      ),
      catchError(() => of(0))
    );
  }

  handleDestinationChange(destinationId: number | null, form: FormGroup) {
    this.destinationInventoryId = destinationId ?? null;

    if (
      destinationId === null ||
      !this.selectedProduct ||
      this.transactionType !== InventoryTypeEnum.TRANSFER
    ) {
      this.destinationCurrentQuantity = null;
      this.destinationProjectedQuantity = null;
      this.updateProjectedQuantities(form);
      return;
    }

    this.fetchProductQuantity(destinationId, this.selectedProduct.sku_id)
      .pipe(take(1))
      .subscribe((quantity) => {
        this.destinationCurrentQuantity = quantity;
        this.updateProjectedQuantities(form);
      });
  }

  resetCalculatedQuantities() {
    this.destinationCurrentQuantity = null;
    this.currentInventoryProjectedQuantity = null;
    this.destinationProjectedQuantity = null;
  }

  updateProjectedQuantities(form: FormGroup) {
    if (!this.selectedProduct) {
      this.currentInventoryProjectedQuantity = null;
      this.destinationProjectedQuantity = null;
      return;
    }

    const quantityValue = Number(form.get('quantity')?.value ?? 0);

    if (!quantityValue || quantityValue <= 0) {
      this.currentInventoryProjectedQuantity = null;
      this.destinationProjectedQuantity = null;
      return;
    }

    const currentQuantity = this.selectedProduct.quantity ?? 0;

    switch (this.transactionType) {
      case InventoryTypeEnum.IN:
        this.currentInventoryProjectedQuantity = currentQuantity + quantityValue;
        this.destinationProjectedQuantity = null;
        break;
      case InventoryTypeEnum.OUT:
        this.currentInventoryProjectedQuantity = Math.max(
          currentQuantity - quantityValue,
          0
        );
        this.destinationProjectedQuantity = null;
        break;
      case InventoryTypeEnum.TRANSFER:
        this.currentInventoryProjectedQuantity = Math.max(
          currentQuantity - quantityValue,
          0
        );
        const destinationBase = this.destinationCurrentQuantity ?? 0;
        this.destinationProjectedQuantity = destinationBase + quantityValue;
        break;
      default:
        this.currentInventoryProjectedQuantity = null;
        this.destinationProjectedQuantity = null;
    }
  }

  getDestinationInventoryName(): string | null {
    if (!this.destinationInventoryId) {
      return null;
    }
    return (
      this.inventoriesSubject.value.find(
        (inventory) => inventory.id === this.destinationInventoryId
      )?.type ?? null
    );
  }

  getTransactionType(): InventoryTypeEnum | null {
    return this.transactionType;
  }

  getSelectedProduct(): GetInventoryItemsResponse | null {
    return this.selectedProduct;
  }

  getCurrentInventoryProjectedQuantity(): number | null {
    return this.currentInventoryProjectedQuantity;
  }

  getDestinationProjectedQuantity(): number | null {
    return this.destinationProjectedQuantity;
  }

  getDestinationCurrentQuantity(): number | null {
    return this.destinationCurrentQuantity;
  }

  handleSubmit(f: FormGroup): Observable<void> {
    if (f.valid) {
      const request = new DoIventoryTransationRequest().parseToRequest(
        f.getRawValue()
      );
      return this.inventoryApiService.doTransaction(request).pipe(
        tap(() => {
          this.toastService.showSuccess('Movimento realizado com sucesso!');
        })
      );
    }
    return EMPTY;
  }
}
