import { inject, Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';
import { ProductsApiService } from '../../service/api-service/products-api.service';
import { BehaviorSubject, EMPTY, Observable, map, switchMap, tap } from 'rxjs';
import {
  GetProductResponse,
  GetSkuResponse,
} from '../../service/responses/products-response';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable()
export class ProductsListService {
  private reloadSubject = new BehaviorSubject<void>(undefined);
  private productApiService = inject(ProductsApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private skusByProductId = new Map<number, GetSkuResponse[]>();

  getAll(): Observable<GetProductResponse[]> {
    return this.reloadSubject.pipe(
      switchMap(() => this.productApiService.getProducts())
    );
  }

  getColumns(): Column[] {
    return [
      {
        header: 'Nome',
        field: 'name',
      },
      {
        header: 'Categoria',
        field: 'categoryName',
        valueFn: (item) => {
          return item.categoryName || '-';
        },
      },
      {
        header: 'Descrição',
        field: 'description',
        valueFn: (item) => {
          if (item.description) {
            return item.description.length > 100
              ? item.description.substring(0, 100) + '...'
              : item.description;
          }
          return '-';
        },
      },
      {
        header: 'Qtd. estoque',
        field: 'quantity',
      },
    ];
  }

  toEditPage(item: GetProductResponse) {
    this.router.navigate(['/produtos/form', item.id]);
  }

  delete(item: GetProductResponse) {
    this.toastService.confirm(() => {
      this.productApiService.deleteProduct(item.id).subscribe(() => {
        this.reloadSubject.next();
      });
    });
  }

  loadSkus(productId: number): Observable<GetSkuResponse[]> {
    if (this.hasSkus(productId)) {
      return EMPTY;
    }
    return this.productApiService.getProductByID(productId).pipe(
      tap((product) => this.skusByProductId.set(product.id, product.skus)),
      map((product) => product.skus)
    );
  }

  hasSkus(productId: number): boolean {
    return this.skusByProductId.has(productId);
  }

  getSkus(productId: number): GetSkuResponse[] {
    return this.skusByProductId.get(productId) ?? [];
  }
}
