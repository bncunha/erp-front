import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SalesSummaryComponent } from '../sales-summary/sales-summary.component';
import { GetPaymentTypeList } from '../../../enums/payment-type.enum';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-sales-payment-form',
  imports: [SharedModule, CardComponent, SalesSummaryComponent, Divider],
  templateUrl: './sales-payment-form.component.html',
  styleUrl: './sales-payment-form.component.scss',
})
export class SalesPaymentFormComponent {
  payments = GetPaymentTypeList();
}
