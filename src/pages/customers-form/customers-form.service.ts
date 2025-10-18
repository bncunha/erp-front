import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, Observable, tap } from 'rxjs';
import { CustomerApiService } from '../../service/api-service/customer-api.service';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../../service/requests/customers-request';
import { ToastService } from '../../shared/components/toast/toast.service';
import { Router } from '@angular/router';

@Injectable()
export class CustomersFormService {
  private api = inject(CustomerApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  load(id: number, form: NgForm) {
    if (!id) return;
    form.resetForm();
    this.api.getById(id).subscribe((customer) => {
      form.form.patchValue({
        name: customer.name,
        cellphone: customer.phone_number,
      });
    });
  }

  submit(form: NgForm, id?: number): Observable<void> {
    if (!form.valid) return EMPTY;
    if (!id) {
      const req = new CreateCustomerRequest().parseToRequest(form.value);
      return this.api.create(req).pipe(
        tap(() => this.toast.showSuccess('Cliente criado com sucesso!'))
      );
    }
    const req = new UpdateCustomerRequest().parseToRequest(form.value);
    return this.api
      .update(id, req)
      .pipe(tap(() => this.toast.showSuccess('Cliente alterado com sucesso!')));
  }

  backPage() {
    this.router.navigate(['/clientes']);
  }
}

