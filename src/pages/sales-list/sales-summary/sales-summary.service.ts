import { Injectable } from '@angular/core';

interface SummaryCard {
  title: string;
  value: string;
}

@Injectable()
export class SalesSummaryService {
  getSummaryCards(): SummaryCard[] {
    return [
      {
        title: 'Total de vendas',
        value: '100',
      },
      {
        title: 'Recebidos',
        value: 'R$ 100,00',
      },
      {
        title: 'A receber (30 dias)',
        value: 'R$ 100,00',
      },
      {
        title: 'Ticket Médio',
        value: 'R$ 100,00',
      },
    ];
  }
}
