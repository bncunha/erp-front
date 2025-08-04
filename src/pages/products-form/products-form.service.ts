import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  CreatProductRequest,
  UpdateProductRequest,
} from '../../service/requests/products-request';
import { ProductsApiService } from '../../service/api-service/products-api.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { CategoriesApiService } from '../../service/api-service/categories-api.service';
import { GetCategoriesResponse } from '../../service/responses/categories-response';
import { SubmitSkuResponse } from './sku-form-dialog/sku-form-dialog.service';
import { CreateSkuRequest } from '../../service/requests/skus-request';
import { Router } from '@angular/router';

@Injectable()
export class ProductsFormService {
  private categoriesReloadSubject = new BehaviorSubject<void>(undefined);

  private categoryApiService = inject(CategoriesApiService);
  private productService = inject(ProductsApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private skus: CreateSkuRequest[] = [];

  getCategories(): Observable<GetCategoriesResponse[]> {
    return this.categoriesReloadSubject.pipe(
      switchMap(() => this.categoryApiService.getCategories())
    );
  }

  submitForm(form: NgForm, id?: number): Observable<number> {
    if (form.valid) {
      if (!id) {
        return this.createProduct(
          new CreatProductRequest().parseToRequest(form.value)
        );
      } else {
        return this.updateProduct(
          new UpdateProductRequest().parseToRequest(form.value),
          id
        );
      }
    }
    return EMPTY;
  }

  getProduct(id: number, form: NgForm) {
    if (!id) return;
    form.resetForm();
    this.productService.getProductByID(id).subscribe((product) => {
      form.form.patchValue(product);
    });
  }

  private createProduct(request: CreatProductRequest) {
    return this.productService.createProduct(request).pipe(
      tap((response) => {
        this.toastService.showSuccess('Produto criado com sucesso!');
      })
    );
  }

  private updateProduct(request: UpdateProductRequest, id: number) {
    return this.productService.updateProduct(request, id).pipe(
      tap((response) => {
        this.toastService.showSuccess('Produto alterado com sucesso!');
      }),
      map(() => 0)
    );
  }

  onCreateCategorySuccess(ngForm: NgForm) {
    this.categoriesReloadSubject.next();
  }

  onCreateSkuSuccess(skuRequest: SubmitSkuResponse) {
    if (!skuRequest.submited) {
      this.skus.push(skuRequest.request);
    }
  }

  backPage(id?: number) {
    if (id) {
      this.router.navigate(['/produtos/form', id]);
    } else {
      this.router.navigate(['/produtos']);
    }
  }
}
