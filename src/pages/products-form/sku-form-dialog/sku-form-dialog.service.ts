import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, Observable, of, tap } from 'rxjs';
import {
  CreateSkuRequest,
  UpdateSkuRequest,
} from '../../../service/requests/skus-request';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { GetSkuResponse } from '../../../service/responses/products-response';
import { NgFor } from '@angular/common';

@Injectable()
export class SkuFormDialogService {
  private skuApiService = inject(SkuApiService);
  private toastService = inject(ToastService);

  private productId!: number;
  private skuEditing?: GetSkuResponse;

  setPRoductId(id: number) {
    this.productId = id;
  }

  getProductId(): number {
    return this.productId!;
  }

  getSkuEditing(): GetSkuResponse | undefined {
    return this.skuEditing;
  }

  onOpenDialog(productId: number, f: NgForm, sku?: GetSkuResponse) {
    this.setPRoductId(productId);
    f.resetForm();
    this.skuEditing = undefined;
    if (sku) {
      this.skuEditing = sku;
      f.form.patchValue(sku);
    }
  }

  submitForm(
    ngForm: NgForm,
    productId: number,
    skuId?: number
  ): Observable<void> {
    if (ngForm.valid) {
      const request = new CreateSkuRequest().parseToRequest(ngForm.value);
      if (!skuId) {
        return this.createSku(request, productId);
      } else {
        return this.updateSku(request, skuId);
      }
    }
    return EMPTY;
  }

  private createSku(request: CreateSkuRequest, productId: number) {
    return this.skuApiService.createSku(request, productId).pipe(
      tap((response) => {
        this.toastService.showSuccess('Variação criada com sucesso!');
      })
    );
  }

  private updateSku(request: UpdateSkuRequest, skuId: number) {
    return this.skuApiService.updateSku(skuId, request).pipe(
      tap((response) => {
        this.toastService.showSuccess('Variação alterada com sucesso!');
      })
    );
  }
}
