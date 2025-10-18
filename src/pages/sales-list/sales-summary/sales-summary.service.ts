import { inject, Injectable } from '@angular/core';
import { GetSummaryResponse } from '../../../service/responses/sales-response';
import { CurrencyPipe } from '@angular/common';

interface SummaryCard {
  title: string;
  value: string | number;
}

@Injectable()
export class SalesSummaryService {
  private currencyPipe = inject(CurrencyPipe);

  getSummaryCards(summary?: GetSummaryResponse): SummaryCard[] {
    return [
      {
        title: 'Total de vendas',
        value: summary?.total_sales || 0,
      },
      {
        title: 'Recebidos',
        value: this.currencyPipe.transform(
          summary?.received_value || 0,
          'BRL'
        ) as string,
      },
      {
        title: 'A receber',
        value: this.currencyPipe.transform(
          summary?.future_revenue || 0,
          'BRL'
        ) as string,
      },
      {
        title: 'Ticket Médio',
        value: this.currencyPipe.transform(
          summary?.average_ticket || 0,
          'BRL'
        ) as string,
      },
    ];
  }
}
