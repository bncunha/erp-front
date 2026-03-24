import { inject, Injectable } from '@angular/core';
import { ProductsApiService } from '../../../service/api-service/products-api.service';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { CreatProductRequest } from '../../../service/requests/products-request';
import { CreateSkuRequest } from '../../../service/requests/skus-request';
import { ToastService } from '../toast/toast.service';
import { generateSkuId } from '../../utils/sku-id.util';

@Injectable()
export class QuickProductDialogService {
  private productsApi = inject(ProductsApiService);
  private skuApi = inject(SkuApiService);
  private toast = inject(ToastService);

  isOpen = false;
  isLoading = false;

  formData: any = {
    name: '',
    description: '',
    code: '',
    color: '',
    size: '',
    price: null,
  };

  open(): void {
    this.formData = {
      name: '',
      description: '',
      code: generateSkuId('SKU'),
      color: '',
      size: '',
      price: null,
    };
    this.isOpen = true;
  }

  submit(onSuccess: () => void): void {
    if (!this.formData.name || !this.formData.code || !this.formData.price) {
      this.toast.showError('Preencha nome, código e preço de venda.');
      return;
    }
    if (!this.formData.color && !this.formData.size) {
      this.toast.showError('Informe cor ou tamanho para o SKU.');
      return;
    }

    this.isLoading = true;
    const productReq = new CreatProductRequest().parseToRequest({
      name: this.formData.name,
      description: this.formData.description,
    });

    this.productsApi.createProduct(productReq).subscribe({
      next: (productId) => {
        const skuReq = new CreateSkuRequest().parseToRequest({
          code: this.formData.code,
          color: this.formData.color,
          size: this.formData.size,
          price: Number(this.formData.price),
        });
        this.skuApi.createSku(skuReq, productId).subscribe({
          next: () => {
            this.toast.showSuccess('Produto e SKU criados com sucesso!');
            this.isLoading = false;
            this.isOpen = false;
            onSuccess();
          },
          error: () => {
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
