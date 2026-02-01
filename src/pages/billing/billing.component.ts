import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BillingService } from './billing.service';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-billing',
  imports: [SharedModule, CardComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
  providers: [BillingService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingComponent implements OnInit {
  service = inject(BillingService);

  columns = this.service.getColumns();

  ngOnInit(): void {
    this.service.loadBilling();
  }
}
