import { inject, Injectable } from '@angular/core';
import { CustomerApiService } from '../../../service/api-service/customer-api.service';
import { GetCustomerResponse } from '../../../service/responses/customers-response';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { GetSkuResponse } from '../../../service/responses/products-response';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { SalesProductsFormFactory } from './form.factory';
import { FormUtil } from '../../../shared/utils/form.utils';

@Injectable()
export class SalesProductsFormService {
  private customerApiService = inject(CustomerApiService);
  private skusApiService = inject(SkuApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  formFactory = new SalesProductsFormFactory();
  private customersReloadSubject = new BehaviorSubject<void>(undefined);

  buildForm(): FormGroup {
    const form = this.formFactory.buildForm();
    this.updateForm(form);
    return form;
  }

  private updateForm(form: FormGroup) {
    const savedForm = sessionStorage.getItem('sales_products_form');
    if (savedForm) {
      const formValue = JSON.parse(savedForm);
      FormUtil.updateFormArray(
        form.get('products') as FormArray,
        formValue.products || [],
        this.formFactory.buildProductForm.bind(this.formFactory)
      );
      form.patchValue(formValue);
    }
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
    return this.customersReloadSubject.pipe(
      switchMap(() => this.customerApiService.getAll())
    );
  }

  getSkus(): Observable<GetSkuResponse[]> {
    return this.skusApiService.getAll().pipe(
      map((skus) => {
        skus.sort((a, b) => {
          // 1️⃣ Prioriza os com quantidade > 0
          if (a.quantity === 0 && b.quantity !== 0) return 1;
          if (a.quantity !== 0 && b.quantity === 0) return -1;

          // 2️⃣ Se ambos têm a mesma condição de quantidade, ordena por nome
          return a.product_name.localeCompare(b.product_name);
        });
        return skus;
      })
    );
  }

  toNextStep(form: FormGroup) {
    if (form.invalid) {
      this.toastService.showError('Formulário inválido');
    } else {
      sessionStorage.setItem('sales_products_form', JSON.stringify(form.value));
      this.router.navigate(['/vendas/novo/pagamento']);
    }
  }

  onCreateCustomerSuccess() {
    this.customersReloadSubject.next();
  }
}
