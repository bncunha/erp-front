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
import { CreateSkuRequest } from '../../service/requests/skus-request';
import { Router } from '@angular/router';
import { GetSkuResponse } from '../../service/responses/products-response';
import { SkuApiService } from '../../service/api-service/sku-api.service';

@Injectable()
export class ProductsFormService {
  private categoriesReloadSubject = new BehaviorSubject<void>(undefined);

  private skusApiService = inject(SkuApiService);
  private categoryApiService = inject(CategoriesApiService);
  private productService = inject(ProductsApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  skusList: GetSkuResponse[] = [];

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
      this.skusList = product.skus;
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

  backPage(id?: number) {
    if (id) {
      this.router.navigate(['/produtos/form', id]);
    } else {
      this.router.navigate(['/produtos']);
    }
  }

  deleteSku(sku: GetSkuResponse, productId: number, form: NgForm) {
    this.toastService.confirm(() => {
      this.skusApiService.deleteSku(sku.id).subscribe(() => {
        this.getProduct(productId, form);
      });
    });
  }
}
