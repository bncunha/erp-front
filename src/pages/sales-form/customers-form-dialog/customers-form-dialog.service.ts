import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, Observable, tap } from 'rxjs';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { CustomerApiService } from '../../../service/api-service/customer-api.service';
import { CreateCustomerRequest } from '../../../service/requests/customers-request';

@Injectable()
export class CustomersFormDialogService {
  private toastService = inject(ToastService);
  private customersApi = inject(CustomerApiService);

  onOpenDialog(form: NgForm) {
    form?.resetForm();
  }

  submitForm(form: NgForm): Observable<void> {
    if (!form.valid) return EMPTY;
    const request = new CreateCustomerRequest().parseToRequest(form.value);
    return this.customersApi.create(request).pipe(
      tap(() => this.toastService.showSuccess('Cliente criado com sucesso!'))
    );
  }
}

