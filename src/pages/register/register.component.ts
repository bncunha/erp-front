import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuItem } from 'primeng/api';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    CheckboxModule,
  ],
  providers: [RegisterService],
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') form!: NgForm;
  steps!: MenuItem[];
  activeIndex = 0;
  isPessoaFisica = false;
  isLoading = false;

  private service = inject(RegisterService);

  ngOnInit(): void {
    this.updateSteps();
  }

  updateSteps(): void {
    this.steps = [
      { label: this.isPessoaFisica ? 'Dados Pessoais' : 'Dados da Empresa' },
      { label: 'Endereço' },
      { label: 'Usuário Administrador' },
    ];
  }

  isCurrentStepValid(): boolean {
    if (!this.form) {
      return false;
    }

    if (this.activeIndex === 0 && this.form.controls['companyData']) {
      return this.form.controls['companyData'].valid;
    }
    if (this.activeIndex === 1 && this.form.controls['address']) {
      return this.form.controls['address'].valid;
    }
    if (this.activeIndex === 2 && this.form.controls['userData']) {
      return this.form.controls['userData'].valid;
    }
    return false;
  }

  nextStep() {
    this.activeIndex++;
  }

  prevStep() {
    this.activeIndex--;
  }

  handleSubmit(form: NgForm) {
    this.isLoading = true;
    this.service.submit(form, this.isPessoaFisica).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        throw err;
      },
    });
  }
}
