import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { GetSkuResponse } from '../../../service/responses/products-response';

export interface CreateSaleProductsFormData {
  id: number;
  price: number;
  quantity: number;
}

export interface CreateSaleProductsFormData {
  customer: number;
  products: CreateSaleProductsFormData[];
}

export class SalesProductsFormFactory {
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

  buildProductForm(item: GetSkuResponse): FormGroup {
    return new FormBuilder().group({
      id: [item.id, [Validators.required]],
      quantity: [0, [Validators.required]],
      price: [item.price],
    });
  }
}
