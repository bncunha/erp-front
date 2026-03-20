import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GetQuotesRequest,
  PatchQuoteStatusRequest,
  UpsertQuoteRequest,
} from '../requests/quotes-request';
import { QuoteListResponse, QuoteResponse } from '../responses/quotes-response';

@Injectable({
  providedIn: 'root',
})
export class QuotesApiService {
  private http = inject(HttpClient);

  list(request: GetQuotesRequest): Observable<QuoteListResponse> {
    return this.http.get<QuoteListResponse>(`${environment.API_URL}/quotes`, {
      params: request as any,
    });
  }

  getById(id: number): Observable<QuoteResponse> {
    return this.http.get<QuoteResponse>(`${environment.API_URL}/quotes/${id}`);
  }

  create(request: UpsertQuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(`${environment.API_URL}/quotes`, request);
  }

  update(id: number, request: UpsertQuoteRequest): Observable<QuoteResponse> {
    return this.http.put<QuoteResponse>(`${environment.API_URL}/quotes/${id}`, request);
  }

  patchStatus(id: number, request: PatchQuoteStatusRequest): Observable<QuoteResponse> {
    return this.http.patch<QuoteResponse>(
      `${environment.API_URL}/quotes/${id}/status`,
      request
    );
  }
}
