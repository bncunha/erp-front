import { inject, Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { GetCustomerResponse } from '../../service/responses/customers-response';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';
import { CustomerApiService } from '../../service/api-service/customer-api.service';

@Injectable()
export class CustomersListService {
  private reload$ = new BehaviorSubject<void>(undefined);
  private router = inject(Router);
  private toast = inject(ToastService);
  private api = inject(CustomerApiService);

  getAll(): Observable<GetCustomerResponse[]> {
    return this.reload$.pipe(switchMap(() => this.api.getAll()));
  }

  getColumns(): Column[] {
    return [
      { header: 'Nome', field: 'name' },
      {
        header: 'Telefone',
        field: 'phone_number',
      },
    ];
  }

  toEditPage(customer: GetCustomerResponse) {
    this.router.navigate(['/clientes/form', customer.id]);
  }

  delete(customer: GetCustomerResponse) {
    this.toast.confirm(() => {
      this.api.delete(customer.id).subscribe(() => {
        this.reload$.next();
      });
    });
  }
}

