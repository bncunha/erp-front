import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterService } from './register.service';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    CheckboxModule,
    SharedModule,
    CardComponent
  ],
  providers: [RegisterService],
})
export class RegisterComponent {
  @ViewChild('f') form!: NgForm;

  service = inject(RegisterService);
  isLoading = false;
  isCepLoading = false;
  cepNotFound = false;
  cepLookupFailed = false;
  private lastCepLookup = '';

  handleSubmit(form: NgForm) {
    this.isLoading = true;
    this.service.submit(form).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        throw err;
      }
    });
  }

  handleCepComplete(cepValue: string | null | undefined) {
    const sanitizedCep = (cepValue ?? '').replace(/\D/g, '');
    const addressGroup = this.form?.form?.get('address');

    if (!addressGroup || sanitizedCep.length !== 8) {
      this.cepNotFound = false;
      this.cepLookupFailed = false;
      return;
    }

    if (sanitizedCep === this.lastCepLookup) {
      return;
    }

    this.lastCepLookup = sanitizedCep;
    this.isCepLoading = true;
    this.cepNotFound = false;
    this.cepLookupFailed = false;

    this.service
      .fetchAddressByCep(sanitizedCep)
      .pipe(finalize(() => (this.isCepLoading = false)))
      .subscribe(data => {
        if (!data) {
          this.cepLookupFailed = true;
          return;
        }

        if (data.erro) {
          this.cepNotFound = true;
          return;
        }

        if (data.logradouro) {
          addressGroup.get('street')?.setValue(data.logradouro);
        }

        if (data.bairro) {
          addressGroup.get('neighborhood')?.setValue(data.bairro);
        }

        if (data.localidade) {
          addressGroup.get('city')?.setValue(data.localidade);
        }

        if (data.uf) {
          addressGroup.get('uf')?.setValue(data.uf);
        }
      });
  }
}
