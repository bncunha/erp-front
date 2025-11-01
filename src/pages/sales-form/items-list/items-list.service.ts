import { inject, Injectable } from '@angular/core';
import { GetSkuResponse } from '../../../service/responses/products-response';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SalesProductsFormFactory } from '../sales-products-form/form.factory';
import { ConfirmationService } from 'primeng/api';
import { applySearchFilter } from '../../../shared/utils/search.utils';

@Injectable()
export class ItemsListService {
  private confirmationService = inject(ConfirmationService);
  private formFactory = new SalesProductsFormFactory();

  filterByText(items: GetSkuResponse[], text: string): GetSkuResponse[] {
    return applySearchFilter(items, text);
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
    const index = value.findIndex((item: any) => item.id === id);
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
      productForm = this.formFactory.addNewProduct(form, item);
    }
    productForm.patchValue({ quantity: productForm.value.quantity + 1 });
  }

  subtractOne(item: GetSkuResponse, form: FormArray) {
    const productForm = this.getFormGroup(form, item.id) as FormGroup;
    if (productForm.value.quantity <= 1) {
      this.confirmationService.confirm({
        message: 'Você realmente deseja remover este item?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.subtract(item, form);
        },
        reject: () => {},
      });
    } else {
      this.subtract(item, form);
    }
  }

  private subtract(item: GetSkuResponse, form: FormArray) {
    let productForm = this.getFormGroup(form, item.id) as FormGroup;
    productForm.patchValue({ quantity: productForm.value.quantity - 1 });
    if (productForm.value.quantity <= 0) {
      this.formFactory.removeProduct(form, item.id);
    }
  }
}
