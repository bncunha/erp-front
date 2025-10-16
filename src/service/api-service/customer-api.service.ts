import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetCustomerResponse } from '../responses/customers-response';
import { CreateCustomerRequest } from '../requests/customers-request';

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
}
