import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, Observable, tap } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';
import { Router } from '@angular/router';
import { RegisterApiService } from '../../service/api-service/register-api.service';
import { CreateCompanyRequest } from '../../service/requests/register-request';
import { MenuItem } from 'primeng/api';

@Injectable()
export class RegisterService {
  private api = inject(RegisterApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  steps!: MenuItem[];
  activeIndex = 0;
  isPessoaFisica = false;

  updateSteps(): void {
    this.steps = [
      { label: this.isPessoaFisica ? 'Dados Pessoais' : 'Dados da Empresa' },
      { label: 'Endereço' },
      { label: 'Usuário Administrador' },
    ];
  }

  isCurrentStepValid(form: NgForm): boolean {
    if (!form) {
      return false;
    }

    if (this.activeIndex === 0 && form.controls['companyData']) {
      return form.controls['companyData'].valid;
    }
    if (this.activeIndex === 1 && form.controls['address']) {
      return form.controls['address'].valid;
    }
    if (this.activeIndex === 2 && form.controls['userData']) {
      return form.controls['userData'].valid;
    }
    return false;
  }

  nextStep() {
    this.activeIndex++;
  }

  prevStep() {
    this.activeIndex--;
  }

  submit(form: NgForm): Observable<void> {
    if (!form.valid) return EMPTY;

    const req = new CreateCompanyRequest().parseToRequest(
      form.value,
      this.isPessoaFisica
    );

    return this.api.create(req).pipe(
      tap(() => {
        this.toast.showSuccess('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      })
    );
  }
}
