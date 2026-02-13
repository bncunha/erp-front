import { inject, Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, EMPTY, finalize, Observable, take, tap } from 'rxjs';
import { SalesApiService } from '../../../service/api-service/sales-api.service';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { CreateSalesReturnRequest } from '../../../service/requests/sales-return-request';
import { GetSaleResponse } from '../../../service/responses/sales-response';
import { GetInventoryResponse } from '../../../service/responses/inventory-response';
import { FormUtil } from '../../../shared/utils/form.utils';

interface ReturnSaleItemOption {
  sku_id: number;
  code: string;
  description: string;
  quantity: number;
  label: string;
}

@Injectable()
export class SalesReturnFormService {
  private formBuilder = inject(FormBuilder);
  private salesApiService = inject(SalesApiService);
  private inventoryApiService = inject(InventoryApiService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  private saleId: number | null = null;
  private saleItems: ReturnSaleItemOption[] = [];
  private inventoriesSubject = new BehaviorSubject<GetInventoryResponse[]>([]);

  isLoading = false;
  isAdmin = false;
  inventories$ = this.inventoriesSubject.asObservable();

  createForm(): FormGroup {
    return this.formBuilder.group({
      returner_name: [null, [Validators.required, Validators.maxLength(255)]],
      reason: [null, [Validators.required, Validators.maxLength(2000)]],
      inventory_destination_id: [null],
      items: this.formBuilder.array([]),
    });
  }

  open(form: FormGroup, sale: GetSaleResponse) {
    this.resetForm(form);
    this.saleId = sale.id;
    this.saleItems = (sale.items || [])
      .filter((item) => !!item.sku_id)
      .map((item) => ({
        sku_id: item.sku_id,
        code: item.code,
        description: item.description,
        quantity: item.quantity,
        label: `${item.code} - ${item.description} (vendido: ${item.quantity})`,
      }));

    this.isAdmin = this.authService.isAdmin();
    this.configureDestinationControl(form);
    this.addItemControl(form);
  }

  resetForm(form: FormGroup) {
    this.saleId = null;
    this.saleItems = [];
    this.inventoriesSubject.next([]);

    form.reset();
    const items = this.getItemsArray(form);
    FormUtil.zerarFormArray(items);
    form.markAsPristine();
    form.markAsUntouched();
  }

  getItemsArray(form: FormGroup): FormArray {
    return form.get('items') as FormArray;
  }

  getItemControls(form: FormGroup): FormGroup[] {
    return this.getItemsArray(form).controls as FormGroup[];
  }

  canAddItem(form: FormGroup): boolean {
    return this.getItemsArray(form).length < this.saleItems.length;
  }

  addItemControl(form: FormGroup) {
    if (!this.canAddItem(form)) {
      return;
    }

    const control = this.formBuilder.group({
      sku_id: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.getItemsArray(form).push(control);
  }

  removeItemControl(form: FormGroup, index: number) {
    this.getItemsArray(form).removeAt(index);
  }

  getAvailableItems(form: FormGroup, index: number): ReturnSaleItemOption[] {
    const selectedIds = new Set<number>();
    this.getItemControls(form).forEach((control, controlIndex) => {
      if (controlIndex === index) {
        return;
      }
      const skuId = Number(control.get('sku_id')?.value);
      if (!Number.isNaN(skuId) && skuId > 0) {
        selectedIds.add(skuId);
      }
    });

    const currentSkuId = Number(
      this.getItemControls(form)[index]?.get('sku_id')?.value,
    );

    return this.saleItems.filter((item) => {
      if (!Number.isNaN(currentSkuId) && item.sku_id === currentSkuId) {
        return true;
      }
      return !selectedIds.has(item.sku_id);
    });
  }

  onSkuChange(form: FormGroup, index: number) {
    const control = this.getItemControls(form)[index];
    if (!control) {
      return;
    }

    const skuId = Number(control.get('sku_id')?.value);
    const quantityControl = control.get('quantity') as FormControl;
    const selectedItem = this.saleItems.find((item) => item.sku_id === skuId);

    if (!selectedItem) {
      control.get('sku_id')?.setValue(null, { emitEvent: false });
      this.applyQuantityValidators(quantityControl, null);
      quantityControl.setValue(1, { emitEvent: false });
      return;
    }

    this.applyQuantityValidators(quantityControl, selectedItem.quantity);
    const currentQuantity = Number(quantityControl.value || 0);
    if (currentQuantity <= 0) {
      quantityControl.setValue(1, { emitEvent: false });
    } else if (currentQuantity > selectedItem.quantity) {
      quantityControl.setValue(selectedItem.quantity, { emitEvent: false });
    }
  }

  getMaxQuantity(form: FormGroup, index: number): number | null {
    const skuId = Number(
      this.getItemControls(form)[index]?.get('sku_id')?.value,
    );
    const item = this.saleItems.find((saleItem) => saleItem.sku_id === skuId);
    return item?.quantity ?? null;
  }

  hasValidItems(form: FormGroup): boolean {
    const request = this.buildRequest(form);
    return request.items.length > 0;
  }

  submit(form: FormGroup): Observable<void> {
    if (!this.saleId || form.invalid) {
      return EMPTY;
    }

    const request = this.buildRequest(form);
    if (!request.items.length) {
      this.toastService.showWarning(
        'Adicione ao menos um item de devolução com quantidade válida.',
      );
      return EMPTY;
    }

    this.isLoading = true;
    return this.salesApiService.createReturn(this.saleId, request).pipe(
      tap(() =>
        this.toastService.showSuccess('Devolução registrada com sucesso!'),
      ),
      finalize(() => {
        this.isLoading = false;
      }),
    );
  }

  private buildRequest(form: FormGroup): CreateSalesReturnRequest {
    const rawValue = form.getRawValue();
    const request = new CreateSalesReturnRequest().parseToRequest({
      ...rawValue,
      inventory_destination_id: this.isAdmin
        ? rawValue.inventory_destination_id
        : null,
    });

    const soldBySku = new Map(
      this.saleItems.map((item) => [item.sku_id, item.quantity]),
    );
    request.items = request.items.filter((item) => {
      const soldQuantity = soldBySku.get(item.sku_id);
      return (
        !!soldQuantity && item.quantity > 0 && item.quantity <= soldQuantity
      );
    });

    if (!this.isAdmin) {
      request.inventory_destination_id = null;
    }

    return request;
  }

  private configureDestinationControl(form: FormGroup) {
    const destinationControl = form.get('inventory_destination_id');
    if (!destinationControl) {
      return;
    }

    if (!this.isAdmin) {
      destinationControl.clearValidators();
      destinationControl.setValue(null);
      destinationControl.updateValueAndValidity({ emitEvent: false });
      return;
    }

    destinationControl.setValidators([Validators.required]);
    destinationControl.setValue(null);
    destinationControl.updateValueAndValidity({ emitEvent: false });

    this.inventoryApiService
      .getAll()
      .pipe(take(1))
      .subscribe({
        next: (inventories) => this.inventoriesSubject.next(inventories),
        error: () => this.inventoriesSubject.next([]),
      });
  }

  private applyQuantityValidators(
    quantityControl: FormControl,
    maxQuantity: number | null,
  ) {
    const validators = [Validators.required, Validators.min(1)];
    if (maxQuantity !== null) {
      validators.push(Validators.max(maxQuantity));
    }

    quantityControl.setValidators(validators);
    quantityControl.updateValueAndValidity({ emitEvent: false });
  }
}
