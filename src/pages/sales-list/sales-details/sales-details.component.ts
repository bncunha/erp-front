import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SalesDetailsService } from './sales-details.service';
import { TimelineModule } from 'primeng/timeline';
import { PaymentBadgeComponent } from '../payment-badge/payment-badge.component';

@Component({
  selector: 'app-sales-details',
  imports: [SharedModule, TimelineModule, PaymentBadgeComponent],
  templateUrl: './sales-details.component.html',
  styleUrl: './sales-details.component.scss',
  providers: [SalesDetailsService],
})
export class SalesDetailsComponent {
  service = inject(SalesDetailsService);
  itensColumns = this.service.getItensColumns();

  open() {
    this.service.toggle();
  }
}
