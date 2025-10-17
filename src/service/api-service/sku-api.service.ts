import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateSkuRequest, UpdateSkuRequest } from '../requests/skus-request';
import { environment } from '../../environments/environment';
import { GetSkuResponse } from '../responses/products-response';
import { GetAllProductsRequest } from '../requests/products-request';

@Injectable({
  providedIn: 'root',
})
export class SkuApiService {
  private http: HttpClient = inject(HttpClient);

  createSku(sku: CreateSkuRequest, productId: number): Observable<void> {
    return this.http.post<void>(
      environment.API_URL + '/products/' + productId + '/skus',
      sku
    );
  }

  deleteSku(id: number): Observable<void> {
    return this.http.delete<void>(environment.API_URL + `/skus/${id}`);
  }

  updateSku(id: number, sku: UpdateSkuRequest): Observable<void> {
    return this.http.put<void>(environment.API_URL + `/skus/${id}`, sku);
  }

  getAll(filters?: GetAllProductsRequest): Observable<GetSkuResponse[]> {
    return this.http.get<GetSkuResponse[]>(environment.API_URL + '/skus', {
      params: filters as any,
    });
  }
}
