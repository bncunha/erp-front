import { inject, Injectable } from '@angular/core';
import {
  CreatProductRequest,
  UpdateProductRequest,
} from '../requests/products-request';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GetProductResponse } from '../responses/products-response';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private http: HttpClient = inject(HttpClient);

  getProducts(): Observable<GetProductResponse[]> {
    return this.http.get<GetProductResponse[]>(
      environment.API_URL + '/products'
    );
  }

  getProductByID(id: number): Observable<GetProductResponse> {
    return this.http.get<GetProductResponse>(
      environment.API_URL + `/products/${id}`
    );
  }

  createProduct(product: CreatProductRequest): Observable<number> {
    return this.http.post<number>(environment.API_URL + '/products', product);
  }

  updateProduct(product: UpdateProductRequest, id: number): Observable<void> {
    return this.http.put<void>(
      environment.API_URL + `/products/${id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(environment.API_URL + `/products/${id}`);
  }
}
