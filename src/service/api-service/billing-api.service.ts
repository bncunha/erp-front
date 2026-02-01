import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BillingPaymentResponse,
  BillingStatusResponse,
  BillingSummaryResponse,
} from '../responses/billing-response';

@Injectable({
  providedIn: 'root',
})
export class BillingApiService {
  private http = inject(HttpClient);

  getSummary(): Observable<BillingSummaryResponse> {
    return this.http.get<BillingSummaryResponse>(environment.API_URL + '/billing');
  }

  getPayments(): Observable<BillingPaymentResponse[]> {
    return this.http.get<BillingPaymentResponse[]>(
      environment.API_URL + '/billing/payments'
    );
  }

  getStatus(): Observable<BillingStatusResponse> {
    return this.http.get<BillingStatusResponse>(
      environment.API_URL + '/billing/status'
    );
  }
}
