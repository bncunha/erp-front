import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SalesSummaryComponent } from '../sales-summary/sales-summary.component';
import {
  GetPaymentIcon,
  GetPaymentTypeList,
  GetPaymentTypeNmae,
  PaymentList,
  PaymentTypeEnum,
} from '../../../enums/payment-type.enum';
import { Divider } from 'primeng/divider';
import { SalesPaymentFormService } from './sales-payment-form.service';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-payment-form',
  imports: [SharedModule, CardComponent, SalesSummaryComponent, Divider],
  templateUrl: './sales-payment-form.component.html',
  styleUrl: './sales-payment-form.component.scss',
  providers: [SalesPaymentFormService],
})
export class SalesPaymentFormComponent implements OnInit {
  service = inject(SalesPaymentFormService);
  payments = GetPaymentTypeList();
  form!: FormArray;

  ngOnInit(): void {
    this.service.initStep();
    this.form = this.service.buildForm();
  }

  getPaymentLabel(payment: PaymentTypeEnum) {
    return GetPaymentTypeNmae(payment);
  }

  getPaymentIcon(payment: PaymentTypeEnum) {
    return GetPaymentIcon(payment);
  }

  getControls() {
    return this.form.controls as FormGroup[];
  }
}
