import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../service/api-service/auth-api.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ForgotPasswordRequest } from '../../service/requests/password-request';

@Injectable()
export class ForgotPasswordService {
  private authApiService = inject(AuthApiService);
  private toastService = inject(ToastService);

  isLoading = false;
  successMessage = '';

  handleSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    const request = new ForgotPasswordRequest().parseToRequest(form.value);

    this.authApiService
      .forgotPassword(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.successMessage =
            'Enviamos as instruções para o e-mail informado. Caso o endereço esteja cadastrado no sistema, você receberá a mensagem em instantes.';
          form.resetForm();
        },
        error: (error) => {
          this.toastService.showError(
            error?.error?.message ||
              'Não foi possível iniciar a recuperação de senha. Tente novamente mais tarde.'
          );
        },
      });
  }
}
