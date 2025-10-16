import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetCustomerResponse } from '../responses/customers-response';
import { CreateCustomerRequest, UpdateCustomerRequest } from '../requests/customers-request';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  private httpCliente = inject(HttpClient);

  getAll(): Observable<GetCustomerResponse[]> {
    return this.httpCliente.get<GetCustomerResponse[]>(
      environment.API_URL + '/customers'
    );
  }

  create(request: CreateCustomerRequest): Observable<void> {
    return this.httpCliente.post<void>(
      environment.API_URL + '/customers',
      request
    );
  }

  getById(id: number): Observable<GetCustomerResponse> {
    return this.httpCliente.get<GetCustomerResponse>(
      environment.API_URL + `/customers/${id}`
    );
  }

  update(id: number, request: UpdateCustomerRequest): Observable<void> {
    return this.httpCliente.put<void>(
      environment.API_URL + `/customers/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.httpCliente.delete<void>(
      environment.API_URL + `/customers/${id}`
    );
  }
}
