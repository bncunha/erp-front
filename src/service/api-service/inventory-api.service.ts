import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GetInventorySummaryResponse,
  GetInventoryItemsResponse,
  GetInventoryResponse,
  GetTransactionHistoryResponse,
} from '../responses/inventory-response';
import { DoIventoryTransationRequest } from '../requests/inventory-request';

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

  getSummary(): Observable<GetInventorySummaryResponse[]> {
    return this.httpCliente.get<GetInventorySummaryResponse[]>(
      environment.API_URL + `/inventory/summary`
    );
  }

  getProductsByInventory(
    inventoryId: number
  ): Observable<GetInventoryItemsResponse[]> {
    return this.httpCliente.get<GetInventoryItemsResponse[]>(
      environment.API_URL + `/inventory/${inventoryId}/items`
    );
  }

  getAllItems(): Observable<GetInventoryItemsResponse[]> {
    return this.httpCliente.get<GetInventoryItemsResponse[]>(
      environment.API_URL + `/inventory/items`
    );
  }

  doTransaction(request: DoIventoryTransationRequest): Observable<void> {
    return this.httpCliente.post<void>(
      environment.API_URL + `/inventory/transaction`,
      request
    );
  }

  getTransactionsHistory(): Observable<GetTransactionHistoryResponse[]> {
    return this.httpCliente.get<GetTransactionHistoryResponse[]>(
      environment.API_URL + `/inventory/transaction`
    );
  }
}
