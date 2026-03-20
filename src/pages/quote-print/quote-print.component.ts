import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { QuotesApiService } from '../../service/api-service/quotes-api.service';
import {
  QuoteResponse,
  QuoteStatus,
} from '../../service/responses/quotes-response';
import {
  getQuoteStatusLabel,
  QuoteStatusEnum,
} from '../../enums/quote-status.enum';

@Component({
  selector: 'app-quote-print',
  imports: [SharedModule, DatePipe],
  templateUrl: './quote-print.component.html',
  styleUrl: './quote-print.component.scss',
})
export class QuotePrintComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private quotesApi = inject(QuotesApiService);

  loading = true;
  quote?: QuoteResponse;
  getQuoteStatus = getQuoteStatusLabel;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.loading = false;
      return;
    }

    this.quotesApi.getById(id).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  print(): void {
    window.print();
  }

  shouldShowWatermark(): string | undefined {
    if (
      this.quote?.status != QuoteStatusEnum.SENT &&
      this.quote?.status != QuoteStatusEnum.APPROVED
    ) {
      return getQuoteStatusLabel(this.quote?.status);
    }
    return undefined;
  }
}
