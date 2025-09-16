import { Component, inject } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SalesSummaryService } from './sales-summary.service';

@Component({
  selector: 'app-sales-summary',
  imports: [CardComponent],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss',
  providers: [SalesSummaryService],
})
export class SalesSummaryComponent {
  service = inject(SalesSummaryService);

  carsd = this.service.getSummaryCards();
}
