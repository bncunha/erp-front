import { CurrencyPipe, DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from '../../shared/components/table/models/column';
import {
  getQuoteStatusClass,
  getQuoteStatusLabel,
  getQuoteStatusOptions,
  QuoteStatusEnum,
} from '../../enums/quote-status.enum';
import { QuotesApiService } from '../../service/api-service/quotes-api.service';
import { CustomerApiService } from '../../service/api-service/customer-api.service';
import { GetQuotesRequest } from '../../service/requests/quotes-request';
import { GetCustomerResponse } from '../../service/responses/customers-response';
import {
  QuoteListItemResponse,
  QuoteStatus,
} from '../../service/responses/quotes-response';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable()
export class QuotesListService {
  private quotesApi = inject(QuotesApiService);
  private customerApi = inject(CustomerApiService);
  private datePipe = inject(DatePipe);
  private currencyPipe = inject(CurrencyPipe);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  rows = 10;
  totalRecords = 0;
  items: QuoteListItemResponse[] = [];
  selectedItem?: QuoteListItemResponse;
  customers: GetCustomerResponse[] = [];

  filters: any = {
    status: [
      QuoteStatusEnum.DRAFT,
      QuoteStatusEnum.SENT,
      QuoteStatusEnum.APPROVED,
      QuoteStatusEnum.REJECTED,
      QuoteStatusEnum.EXPIRED,
    ],
    customer_id: null,
    valid_until_start: null,
    valid_until_end: null,
    created_at_start: null,
    created_at_end: null,
    search: '',
  };

  currentQuery: GetQuotesRequest = new GetQuotesRequest().parseToRequest({
    page: 1,
    page_size: this.rows,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  statusOptions = getQuoteStatusOptions();

  columns: Column[] = [
    { header: 'Número', field: 'quote_number' },
    {
      header: 'Cliente',
      field: 'customer_name',
      valueFn: (item) => item.customer?.name || '-',
    },
    {
      header: 'Criação',
      field: 'created_at',
      valueFn: (item) =>
        this.datePipe.transform(item.created_at, 'short') || '-',
    },
    {
      header: 'Validade',
      field: 'valid_until',
      valueFn: (item) =>
        this.datePipe.transform(item.valid_until, 'dd/MM/yyyy') || '-',
    },
    {
      header: 'Status',
      field: 'status',
      badgeClassFn: (item) => getQuoteStatusClass(item.status),
      badgeLabelFn: (item) => getQuoteStatusLabel(item.status),
    },
    {
      header: 'Total',
      field: 'total_amount',
      valueFn: (item) =>
        this.currencyPipe.transform(item.total_amount, 'BRL') || '-',
    },
    {
      header: 'Entrada %',
      field: 'down_payment_percentage',
      valueFn: (item) => `${item.down_payment_percentage}%`,
    },
    {
      header: 'Valor Entrada',
      field: 'down_payment_amount',
      valueFn: (item) =>
        this.currencyPipe.transform(item.down_payment_amount, 'BRL') || '-',
    },
    { header: 'Frete', field: 'shipping_description' },
  ];

  init(): void {
    this.currentQuery = new GetQuotesRequest().parseToRequest({
      ...this.currentQuery,
      ...this.filters,
    });
    this.loadCustomers();
  }

  onFilter(): void {
    this.currentQuery = new GetQuotesRequest().parseToRequest({
      ...this.currentQuery,
      ...this.filters,
      page: 1,
      page_size: this.rows,
      valid_until_start: this.filters.valid_until_start
        ? this.formatDate(this.filters.valid_until_start)
        : null,
      valid_until_end: this.filters.valid_until_end
        ? this.formatDate(this.filters.valid_until_end)
        : null,
      created_at_start: this.filters.created_at_start
        ? this.formatDate(this.filters.created_at_start)
        : null,
      created_at_end: this.filters.created_at_end
        ? this.formatDate(this.filters.created_at_end)
        : null,
    });
    this.fetch();
  }

  cleanFilters(): void {
    this.filters = {
      status: null,
      customer_id: null,
      valid_until_start: null,
      valid_until_end: null,
      created_at_start: null,
      created_at_end: null,
      search: '',
    };
    this.currentQuery = new GetQuotesRequest().parseToRequest({
      page: 1,
      page_size: this.rows,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    this.fetch();
  }

  onLazyLoad(event: any): void {
    const page = Math.floor((event.first || 0) / (event.rows || this.rows)) + 1;
    this.rows = event.rows || this.rows;
    this.currentQuery = new GetQuotesRequest().parseToRequest({
      ...this.currentQuery,
      page,
      page_size: this.rows,
      sort_by: event.sortField || this.currentQuery.sort_by,
      sort_order: event.sortOrder === 1 ? 'asc' : 'desc',
    });
    this.fetch();
  }

  goToNew(): void {
    this.router.navigate(['/producao/orcamentos/novo']);
  }

  edit(item: QuoteListItemResponse): void {
    this.router.navigate(['/producao/orcamentos', item.id]);
  }

  openPdf(item: QuoteListItemResponse): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/producao/orcamentos', item.id, 'impressao']),
    );
    window.open(url, '_blank');
  }

  duplicate(item: QuoteListItemResponse): void {
    this.toast.confirm(
      () => {
        this.quotesApi.duplicate(item.id).subscribe({
          next: (response) => {
            this.toast.showSuccess('Orçamento duplicado com sucesso!');
            this.router.navigate(['/producao/orcamentos', response.id]);
          },
          error: () =>
            this.toast.showError('Não foi possível duplicar o orçamento.'),
        });
      },
      `Confirma duplicar o orçamento ${item.quote_number}?`,
      'Duplicar orçamento',
    );
  }

  getAllowedStatuses(item: QuoteListItemResponse): QuoteStatus[] {
    const status = (item.status || '').toUpperCase();
    if (status === QuoteStatusEnum.DRAFT) {
      return [QuoteStatusEnum.SENT, QuoteStatusEnum.CANCELED];
    }
    if (status === QuoteStatusEnum.SENT) {
      return [
        QuoteStatusEnum.APPROVED,
        QuoteStatusEnum.REJECTED,
        QuoteStatusEnum.CANCELED,
      ];
    }
    return [];
  }

  changeStatus(item: QuoteListItemResponse, status: QuoteStatus): void {
    const nextStatusLabel = getQuoteStatusLabel(status);
    this.toast.confirm(
      () => {
        this.quotesApi.patchStatus(item.id, { status }).subscribe({
          next: () => this.fetch(),
          error: () =>
            this.toast.showError(
              'Não foi possível alterar o status do orçamento.',
            ),
        });
      },
      `Confirma alterar o status do orçamento ${item.quote_number} para ${nextStatusLabel}?`,
      'Alterar status',
    );
  }

  setSelectedItem(item?: QuoteListItemResponse): void {
    this.selectedItem = item;
  }

  private fetch(): void {
    this.loading = true;
    this.quotesApi.list(this.currentQuery).subscribe({
      next: (response) => {
        this.items = response.items || [];
        this.totalRecords = response.total || 0;
        if (this.selectedItem) {
          const selectedFromList = this.items.find(
            (item) => item.id === this.selectedItem?.id,
          );
          this.selectedItem = selectedFromList;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private loadCustomers(): void {
    this.customerApi
      .getAll()
      .subscribe((customers) => (this.customers = customers || []));
  }

  private formatDate(value: Date): string {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  canEdit(item: QuoteListItemResponse): boolean {
    return (
      item.status === QuoteStatusEnum.DRAFT ||
      item.status === QuoteStatusEnum.SENT
    );
  }
}
