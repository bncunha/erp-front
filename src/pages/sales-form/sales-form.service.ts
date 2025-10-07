import { inject, Injectable } from '@angular/core';
import { CustomerApiService } from '../../service/api-service/customer-api.service';
import { GetCustomerResponse } from '../../service/responses/customers-response';
import { map, Observable } from 'rxjs';
import { GetSkuResponse } from '../../service/responses/products-response';
import { SkuApiService } from '../../service/api-service/sku-api.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class SalesFormService {
  private customerApiService = inject(CustomerApiService);
  private skusApiService = inject(SkuApiService);

  buildForm(): FormGroup {
    return new FormBuilder().group({
      customer: [null, [Validators.required]],
      products: new FormArray([], [Validators.required]),
    });
  }

  addNewProduct(form: FormArray, item: GetSkuResponse): FormGroup {
    const productForm = this.buildProductForm(item);
    form.push(productForm);
    return productForm;
  }

  removeProduct(form: FormArray, id: number) {
    form.removeAt(form.value.findIndex((item: any) => item.product === id));
  }

  private buildProductForm(item: GetSkuResponse): FormGroup {
    return new FormBuilder().group({
      product: [item.id, [Validators.required]],
      quantity: [0, [Validators.required]],
      price: [item.price],
    });
  }

  getTotalValue(form: FormGroup): number {
    return form.value.products.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price;
    }, 0);
  }

  getTotalItems(form: FormGroup): number {
    return form.value.products.reduce((acc: number, item: any) => {
      return acc + item.quantity;
    }, 0);
  }

  getCustomers(): Observable<GetCustomerResponse[]> {
    return this.customerApiService.getAll();
  }

  getSkus(): Observable<GetSkuResponse[]> {
    return this.skusApiService
      .getAll()
      .pipe(map((skus) => skus.filter((sku) => sku.quantity > 0)));
  }
}
