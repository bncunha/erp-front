import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetCustomerResponse } from '../responses/customers-response';

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
}
