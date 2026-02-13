import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GetAllSalesResponse,
  GetSaleInstallmentResponse,
  GetSaleResponse,
} from '../responses/sales-response';
import {
  CreateSaleRequest,
  GetAllSalesRequest,
  UpdatePaymentStatusRequest,
} from '../requests/sales-request';
import { CreateSalesReturnRequest } from '../requests/sales-return-request';

@Injectable({
  providedIn: 'root',
})
export class SalesApiService {
  private http: HttpClient = inject(HttpClient);

  getAll(filters: GetAllSalesRequest): Observable<GetAllSalesResponse> {
    return this.http.get<GetAllSalesResponse>(`${environment.API_URL}/sales`, {
      params: filters as any,
    });
  }

  getById(id: number): Observable<GetSaleResponse> {
    return this.http
      .get<GetSaleResponse>(`${environment.API_URL}/sales/${id}`)
      .pipe(
        map((response) => {
          response.payments?.forEach((payment) => {
            payment.installments = payment.installments?.map((installment) =>
              Object.assign(new GetSaleInstallmentResponse(), installment)
            );
          });
          return response;
        })
      );
  }

  createSale(request: CreateSaleRequest): Observable<void> {
    return this.http.post<void>(`${environment.API_URL}/sales`, request);
  }

  updatePaymentStatus(
    saleId: number,
    paymentId: number,
    request: UpdatePaymentStatusRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${environment.API_URL}/sales/${saleId}/payments/${paymentId}`,
      request
    );
  }

  createReturn(saleId: number, request: CreateSalesReturnRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.API_URL}/sales/${saleId}/returns`,
      request
    );
  }
}
