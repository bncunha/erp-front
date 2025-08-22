import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetInventoryResponse } from '../responses/inventory-response';

@Injectable({
  providedIn: 'root',
})
export class InventoryApiService {
  httpCliente = inject(HttpClient);

  getAll(): Observable<GetInventoryResponse[]> {
    return this.httpCliente.get<GetInventoryResponse[]>(
      environment.API_URL + `/inventory`
    );
  }
}
