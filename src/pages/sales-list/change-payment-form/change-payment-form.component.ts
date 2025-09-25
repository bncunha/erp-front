import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { GetPaymentEnumList } from '../../../enums/payment.enum';

@Component({
  selector: 'app-change-payment-form',
  imports: [SharedModule],
  templateUrl: './change-payment-form.component.html',
  styleUrl: './change-payment-form.component.scss',
})
export class ChangePaymentFormComponent {
  isVisible: boolean = false;
  paymentList = GetPaymentEnumList();

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
