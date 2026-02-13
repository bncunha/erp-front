import { Component, EventEmitter, Output, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup } from '@angular/forms';
import { SalesReturnFormService } from './sales-return-form.service';
import { GetSaleResponse } from '../../../service/responses/sales-response';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-sales-return-form',
  imports: [SharedModule, TextareaModule],
  templateUrl: './sales-return-form.component.html',
  styleUrl: './sales-return-form.component.scss',
  providers: [SalesReturnFormService],
})
export class SalesReturnFormComponent {
  @Output() submitSuccess = new EventEmitter<void>();

  service = inject(SalesReturnFormService);
  private toastService = inject(ToastService);

  isVisible = false;
  form: FormGroup;

  constructor() {
    this.form = this.service.createForm();
  }

  open(sale: GetSaleResponse) {
    this.isVisible = true;
    setTimeout(() => {
      this.service.open(this.form, sale);
    });
  }

  close() {
    this.isVisible = false;
    this.service.resetForm(this.form);
  }

  submit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (!this.service.hasValidItems(form)) {
      this.toastService.showWarning(
        'Adicione ao menos um item de devolução com quantidade válida.'
      );
      return;
    }

    this.toastService.confirm(
      () =>
        this.service.submit(form).subscribe(() => {
          this.close();
          this.submitSuccess.emit();
        }),
      'A devolução recalculará as parcelas e retornará os produtos ao estoque. Esta operação é irreversível. Deseja continuar?',
      'Confirmar Devolução'
    );
  }
}
