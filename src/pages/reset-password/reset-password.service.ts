import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  AuthApiService,
} from '../../service/api-service/auth-api.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ChangePasswordRequest } from '../../service/requests/password-request';

@Injectable()
export class ResetPasswordService {
  private authApiService = inject(AuthApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  passwordMismatch = false;
  isNewUser = false;
  private code = '';
  private uuid = '';

  initializeParams() {
    const params = this.route.snapshot.queryParamMap;
    this.code = params.get('code') || '';
    this.uuid = params.get('uuid') || '';
    this.isNewUser = params.get('new_user') === 'true';

    if (!this.code || !this.uuid) {
      this.toastService.showError('Link de redefinição inválido ou expirado.');
      this.router.navigate(['/login']);
    }
  }

  clearPasswordMismatch() {
    this.passwordMismatch = false;
  }

  handleSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const request: ChangePasswordRequest = new ChangePasswordRequest().parseToRequest(form.value, this.code, this.uuid);

    if (!request.passwordsMatch(form.value.confirmPassword)) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;
    this.isLoading = true;


    this.authApiService
      .changePassword(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Senha redefinida com sucesso.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastService.showError(
            error?.error?.message ||
              'Não foi possível redefinir a senha. Tente novamente mais tarde.'
          );
        },
      });
  }
}
