import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SalesApiService } from '../../../service/api-service/sales-api.service';
import { EMPTY, finalize, tap } from 'rxjs';
import { UpdatePaymentStatusRequest } from '../../../service/requests/sales-request';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { PaymentEnum } from '../../../enums/payment.enum';

@Injectable()
export class ChangePaymentFormService {
  private salesApiService = inject(SalesApiService);
  private toastService = inject(ToastService);

  isLoading: boolean = false;

  dateIsRequired(f: NgForm) {
    return f.value.status === PaymentEnum.PAID;
  }

  submit(form: NgForm, saleId: number, paymentId: number) {
    if (form.valid) {
      const request = new UpdatePaymentStatusRequest().parseToRequest(
        form.value
      );
      this.isLoading = true;
      return this.salesApiService
        .updatePaymentStatus(saleId, paymentId, request)
        .pipe(
          tap(() => {
            this.toastService.showSuccess('Alteração realizada com sucesso!');
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );
    }
    return EMPTY;
  }
}
