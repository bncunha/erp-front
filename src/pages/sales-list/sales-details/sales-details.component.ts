import { Component, EventEmitter, inject, Output, output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SalesDetailsService } from './sales-details.service';
import { TimelineModule } from 'primeng/timeline';
import { PaymentBadgeComponent } from '../payment-badge/payment-badge.component';
import { ChangePaymentFormComponent } from '../change-payment-form/change-payment-form.component';
import {
  GetSaleResponse,
  GetSimplifiedSaleResponse,
} from '../../../service/responses/sales-response';
import { DividerModule } from 'primeng/divider';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sales-details',
  imports: [
    SharedModule,
    TimelineModule,
    PaymentBadgeComponent,
    ChangePaymentFormComponent,
    DividerModule,
  ],
  templateUrl: './sales-details.component.html',
  styleUrl: './sales-details.component.scss',
  providers: [SalesDetailsService, CurrencyPipe],
})
export class SalesDetailsComponent {
  @Output() changePaymentSuccess = new EventEmitter<void>();
  service = inject(SalesDetailsService);
  itensColumns = this.service.getItensColumns();
  sale?: GetSaleResponse;

  open(ev: GetSimplifiedSaleResponse) {
    this.service.toggle();
    this.getSale(ev.id);
  }

  getSale(id: number) {
    this.service.getSale(id).subscribe((response) => {
      this.sale = response;
    });
  }

  onChangePaymentSuccess() {
    this.getSale(this.sale!.id);
    this.changePaymentSuccess.emit();
  }
}
