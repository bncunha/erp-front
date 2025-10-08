import { inject, Injectable } from '@angular/core';
import { CustomerApiService } from '../../../service/api-service/customer-api.service';
import { GetCustomerResponse } from '../../../service/responses/customers-response';
import { map, Observable } from 'rxjs';
import { GetSkuResponse } from '../../../service/responses/products-response';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { SalesProductsFormFactory } from './form.factory';

@Injectable()
export class SalesProductsFormService {
  private customerApiService = inject(CustomerApiService);
  private skusApiService = inject(SkuApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  formFactory = new SalesProductsFormFactory();

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

  toNextStep(form: FormGroup) {
    if (form.invalid) {
      console.log(form.invalid);
      this.toastService.showError('Formulário inválido');
    } else {
      this.router.navigate(['/vendas/novo/pagamento']);
    }
  }
}
