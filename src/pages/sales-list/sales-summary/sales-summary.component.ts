import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SalesSummaryService } from './sales-summary.service';
import { GetSummaryResponse } from '../../../service/responses/sales-response';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-summary',
  imports: [CardComponent],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss',
  providers: [SalesSummaryService, DatePipe],
})
export class SalesSummaryComponent implements OnChanges {
  @Input() summary?: GetSummaryResponse;

  service = inject(SalesSummaryService);

  cards = this.service.getSummaryCards(this.summary);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary']) {
      this.cards = this.service.getSummaryCards(this.summary);
    }
  }
}
