import { inject, Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';
import { ProductsApiService } from '../../service/api-service/products-api.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import {
  GetProductResponse,
  GetSkuResponse,
} from '../../service/responses/products-response';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';
import { SkuApiService } from '../../service/api-service/sku-api.service';

@Injectable()
export class ProductsListService {
  private reloadSubject = new BehaviorSubject<void>(undefined);
  private productApiService = inject(ProductsApiService);
  private skuApiService = inject(SkuApiService);
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
        header: 'ID',
        field: 'id',
      },
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
        field: 'inventory_qtd',
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

  onRowExpand(item: GetProductResponse) {
    this.productApiService.getProductByID(item.id).subscribe((product) => {
      this.skusByProductId.set(product.id, product.skus);
    });
  }

  getSkus(productId: number): GetSkuResponse[] {
    return this.skusByProductId.get(productId) ?? [];
  }
}
