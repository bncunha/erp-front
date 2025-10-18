import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { GetPaymentName, PaymentEnum } from '../../../enums/payment.enum';

@Component({
  selector: 'app-payment-badge',
  imports: [SharedModule],
  templateUrl: './payment-badge.component.html',
  styleUrl: './payment-badge.component.scss',
})
export class PaymentBadgeComponent implements OnInit {
  @Input() paymentType!: PaymentEnum | any;
  paymentLabel!: string;

  ngOnInit(): void {
    this.paymentLabel = GetPaymentName(this.paymentType);
  }
}
