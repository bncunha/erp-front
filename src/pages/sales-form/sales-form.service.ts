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

  private buildProductForm(): FormGroup {
    return new FormBuilder().group({
      product: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
    });
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
