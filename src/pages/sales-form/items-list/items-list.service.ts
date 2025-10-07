import { inject, Injectable } from '@angular/core';
import { GetSkuResponse } from '../../../service/responses/products-response';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SalesFormService } from '../sales-form.service';

@Injectable()
export class ItemsListService {
  private salesFormService = inject(SalesFormService);

  filterByText(items: GetSkuResponse[], text: string): GetSkuResponse[] {
    if (!text) {
      return items;
    }
    return items.filter((item) => {
      const words = text.split(' ');
      return words.every((word) => {
        const values = Object.values(item).map((v) => String(v));
        return values.some((value) =>
          value.toLowerCase().includes(word.toLowerCase())
        );
      });
    });
  }

  showQuantityForm(item: GetSkuResponse, productsForm: FormArray) {
    return (
      this.getFormGroup(productsForm, item.id)?.value?.quantity !== undefined
    );
  }

  getQuantityForm(form: FormArray, id: number): FormControl {
    return this.getFormGroup(form, id)?.get('quantity') as FormControl;
  }

  getFormGroup(form: FormArray, id: number): FormGroup | null {
    const value = form.value;
    const index = value.findIndex((item: any) => item.product === id);
    if (index === -1) {
      return null;
    }
    return form.at(index) as FormGroup;
  }

  addOne(item: GetSkuResponse, form: FormArray) {
    let productForm = this.getFormGroup(form, item.id);
    const currentQuantity = productForm?.value?.quantity || 0;
    if (currentQuantity >= item.quantity) {
      return;
    }
    if (!productForm) {
      productForm = this.salesFormService.addNewProduct(form, item);
    }
    productForm.patchValue({ quantity: productForm.value.quantity + 1 });
  }

  subtractOne(item: GetSkuResponse, form: FormArray) {
    let productForm = this.getFormGroup(form, item.id) as FormGroup;
    productForm.patchValue({ quantity: productForm.value.quantity - 1 });
    if (productForm.value.quantity <= 0) {
      this.salesFormService.removeProduct(form, item.id);
    }
  }
}
