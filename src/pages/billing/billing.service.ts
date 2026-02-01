import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Column } from '../../shared/components/table/models/column';
import { BillingApiService } from '../../service/api-service/billing-api.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { DateUtils } from '../../shared/utils/date.utils';
import { BillingPageState } from './billing.models';
import {
  BillingPaymentViewModel,
  BillingSummaryViewModel,
} from '../../service/models/billing.models';
import {
  mapBillingPaymentResponse,
  mapBillingSummaryResponse,
} from './billing.mappers';

@Injectable()
export class BillingService {
  private billingApiService = inject(BillingApiService);
  private toastService = inject(ToastService);
  private currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  private stateSubject = new BehaviorSubject<BillingPageState>({
    summary: null,
    payments: [],
    summaryLoading: true,
    paymentsLoading: true,
    summaryErrorMessage: null,
    paymentsErrorMessage: null,
  });

  readonly state$ = this.stateSubject.asObservable();

  loadBilling(): void {
    this.updateState({
      summaryLoading: true,
      paymentsLoading: true,
      summaryErrorMessage: null,
      paymentsErrorMessage: null,
    });

    this.loadSummary();
    this.loadPayments();
  }

  getColumns(): Column[] {
    return [
      {
        header: 'Id',
        field: 'id',
      },
      {
        header: 'Plano',
        field: 'planName',
      },
      {
        header: 'Provider',
        field: 'provider',
      },
      {
        header: 'Status',
        field: 'status',
        badgeClassFn: (item: BillingPaymentViewModel) =>
          this.getStatusClass(item.status),
        badgeLabelFn: (item: BillingPaymentViewModel) =>
          this.getStatusLabel(item.status),
      },
      {
        header: 'Valor',
        field: 'amount',
        valueFn: (item: BillingPaymentViewModel) =>
          this.currencyFormatter.format(item.amount || 0),
      },
      {
        header: 'Pago em',
        field: 'paidAt',
        valueFn: (item: BillingPaymentViewModel) =>
          item.paidAt ? this.formatDate(item.paidAt) : '-',
      },
      {
        header: 'Criado em',
        field: 'createdAt',
        valueFn: (item: BillingPaymentViewModel) =>
          this.formatDate(item.createdAt),
      },
    ];
  }

  getStatusClass(status?: string | null): string {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'ACTIVE':
        return 'billing-badge--active';
      case 'PAST_DUE':
        return 'billing-badge--past-due';
      case 'CANCELED':
        return 'billing-badge--canceled';
      case 'PAID':
        return 'billing-badge--paid';
      case 'PENDING':
        return 'billing-badge--pending';
      case 'FAILED':
        return 'billing-badge--failed';
      default:
        return 'billing-badge--default';
    }
  }

  getStatusLabel(status?: string | null): string {
    if (!status) {
      return '-';
    }
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'PAST_DUE':
        return 'Atrasado';
      case 'CANCELED':
        return 'Cancelado';
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'FAILED':
        return 'Falhou';
      default:
        return 'Não definido';
    }
  }

  formatPrice(summary: BillingSummaryViewModel | null): string {
    if (!summary) {
      return '-';
    }
    return this.currencyFormatter.format(summary.planPrice || 0);
  }

  formatDate(date: Date): string {
    return DateUtils.formatDate(date, 'dd/MM/yyyy');
  }

  private loadSummary(): void {
    this.billingApiService
      .getSummary()
      .pipe(map((summary) => mapBillingSummaryResponse(summary)))
      .subscribe({
        next: (summary) => {
          this.updateState({
            summary,
            summaryLoading: false,
            summaryErrorMessage: null,
          });
        },
        error: (error) => {
          console.error('Erro ao carregar cobranÃ§a (resumo)', error);
          this.toastService.showError(
            'Não foi possível carregar o resumo de cobrança.'
          );
          this.updateState({
            summaryLoading: false,
            summaryErrorMessage:
              'Não foi possível carregar o resumo de cobrança.',
          });
        },
      });
  }

  private loadPayments(): void {
    this.billingApiService
      .getPayments()
      .pipe(
        map((payments) =>
          payments.map((payment) => mapBillingPaymentResponse(payment))
        )
      )
      .subscribe({
        next: (payments) => {
          this.updateState({
            payments,
            paymentsLoading: false,
            paymentsErrorMessage: null,
          });
        },
        error: (error) => {
          console.error('Erro ao carregar cobranÃ§a (pagamentos)', error);
          this.toastService.showError(
            'Não foi possível carregar os pagamentos.'
          );
          this.updateState({
            paymentsLoading: false,
            paymentsErrorMessage: 'Não foi possível carregar os pagamentos.',
          });
        },
      });
  }
  private updateState(patch: Partial<BillingPageState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...patch,
    });
  }
}



