import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateSkuRequest, UpdateSkuRequest } from '../requests/skus-request';
import { environment } from '../../environments/environment';
import { GetSkuResponse } from '../responses/products-response';
import { GetAllProductsRequest } from '../requests/products-request';
import {
  GetSkuInventoryResponse,
  GetSkuTransactionResponse,
} from '../responses/sku-inventory-response';

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
    }).pipe(
      map((skus) => skus.map((sku) => new GetSkuResponse(sku)))
    );
  }

  getInventoryById(id: number): Observable<GetSkuInventoryResponse[]> {
    return this.http.get<GetSkuInventoryResponse[]>(
      environment.API_URL + `/skus/${id}/inventory`
    );
  }

  getTransactionsById(id: number): Observable<GetSkuTransactionResponse[]> {
    return this.http.get<GetSkuTransactionResponse[]>(
      environment.API_URL + `/skus/${id}/transactions`
    );
  }
}
