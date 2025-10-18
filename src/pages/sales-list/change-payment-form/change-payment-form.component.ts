import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { GetPaymentEnumListEditable } from '../../../enums/payment.enum';
import { GetSaleInstallmentResponse } from '../../../service/responses/sales-response';
import { GetPaymentTypeNmae } from '../../../enums/payment-type.enum';
import { ChangePaymentFormService } from './change-payment-form.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-payment-form',
  imports: [SharedModule],
  templateUrl: './change-payment-form.component.html',
  styleUrl: './change-payment-form.component.scss',
  providers: [ChangePaymentFormService],
})
export class ChangePaymentFormComponent {
  @ViewChild('f') ngForm!: NgForm;
  @Output() submitSuccess = new EventEmitter<void>();

  service = inject(ChangePaymentFormService);

  isVisible: boolean = false;
  paymentList = GetPaymentEnumListEditable();
  installment?: GetSaleInstallmentResponse;
  saleId?: number;
  paymentType?: string;
  selectedDate = new Date();

  open(isntallment: GetSaleInstallmentResponse, saleId: number) {
    this.isVisible = true;
    this.installment = isntallment;
    this.saleId = saleId;
    this.paymentType = this.getPaymentTypeName(isntallment);
  }

  getPaymentTypeName(isntallment: GetSaleInstallmentResponse) {
    return GetPaymentTypeNmae(isntallment.payment_type);
  }

  submit(
    form: NgForm,
    installment: GetSaleInstallmentResponse,
    saleId: number
  ) {
    this.service.submit(form, saleId, installment.id).subscribe(() => {
      this.close();
      this.submitSuccess.emit();
    });
  }

  close() {
    this.isVisible = false;
    this.ngForm.form.reset();
    this.selectedDate = new Date();
  }
}
