import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, finalize, Observable, of, tap } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';
import { Router } from '@angular/router';
import { RegisterApiService } from '../../service/api-service/register-api.service';
import { CreateCompanyRequest } from '../../service/requests/register-request';

@Injectable()
export class RegisterService {
  private api = inject(RegisterApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  isPessoaFisica = false;
  confirmPassword = '';

  submit(form: NgForm): Observable<void> {
    if (!form.valid) return of(null) as any;

    if (form.value?.userData?.password !== this.confirmPassword) {
      return of(null) as any;
    }

    const req = new CreateCompanyRequest().parseToRequest(
      form.value,
      this.isPessoaFisica
    );

    return this.api.create(req).pipe(
      tap(() => {
        this.toast.showSuccess('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      }),
    );
  }
}
