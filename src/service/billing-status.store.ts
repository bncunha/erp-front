import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, map, of } from 'rxjs';
import { BillingApiService } from './api-service/billing-api.service';
import { ToastService } from '../shared/components/toast/toast.service';
import { BillingStatusViewModel } from './models/billing.models';
import { mapBillingStatusResponse } from '../pages/billing/billing.mappers';
import { DateUtils } from '../shared/utils/date.utils';

const DEFAULT_READONLY_REASON =
  'Apenas consulta ativado, contate os administradores';

@Injectable({
  providedIn: 'root',
})
export class BillingStatusStore {
  private billingApiService = inject(BillingApiService);
  private toastService = inject(ToastService);
  private statusSubject = new BehaviorSubject<BillingStatusViewModel | null>(
    null
  );

  readonly status$ = this.statusSubject.asObservable();
  readonly canWrite$ = this.status$.pipe(
    map((status) => status?.canWrite ?? false),
    distinctUntilChanged()
  );
  readonly readonlyReason$ = this.status$.pipe(
    map((status) => status?.reason || DEFAULT_READONLY_REASON),
    distinctUntilChanged()
  );
  readonly planFooterLabel$ = this.status$.pipe(
    map((status) => {
      if (!status) {
        return null;
      }
      const formattedDate = DateUtils.formatDate(
        status.currentPeriodEnd,
        'dd/MM/yyyy'
      );
      const daysRemaining = this.getDaysRemaining(status.currentPeriodEnd);
      const showRemaining =
        typeof daysRemaining === 'number' && daysRemaining <= 15;
      const remainingLabel = showRemaining
        ? ` (${daysRemaining} ${
            daysRemaining === 1 ? 'dia' : 'dias'
          } restantes)`
        : '';
      return `Plano: ${status.planName} - Válido até ${formattedDate}${remainingLabel}`;
    }),
    distinctUntilChanged()
  );

  readonly isTrial$ = this.status$.pipe(
    map((status) => (status?.planName || '').toUpperCase() === 'TRIAL'),
    distinctUntilChanged()
  );

  loadStatus(): Observable<BillingStatusViewModel | null> {
    if (!localStorage.getItem('token')) {
      this.statusSubject.next(null);
      return of(null);
    }
    return this.billingApiService.getStatus().pipe(
      map((response) => mapBillingStatusResponse(response)),
      map((status) => {
        this.statusSubject.next(status);
        return status;
      }),
      catchError((error) => {
        console.error('Erro ao carregar status de billing', error);
        this.toastService.showWarning('Não foi possível validar o plano');
        this.statusSubject.next(null);
        return of(null);
      })
    );
  }

  reset(): void {
    this.statusSubject.next(null);
  }

  private getDaysRemaining(endDate: Date | null | undefined): number | null {
    if (!endDate) {
      return null;
    }
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const diffMs = end.getTime() - startOfToday.getTime();
    const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    return Math.max(days, 0);
  }
}

