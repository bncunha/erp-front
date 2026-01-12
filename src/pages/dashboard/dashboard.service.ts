import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
  catchError,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApiService } from '../../service/api-service/dashboard-api.service';
import {
  DashboardWidgetDataResponse,
  DashboardWidgetItem,
} from '../../service/responses/dashboard-response';
import { buildWidgetRequest, mapWidgetResponseToViewModel } from './dashboard.mappers';
import {
  DashboardState,
  DashboardStateStatus,
  DashboardWidgetStatus,
  DashboardWidgetViewModel,
} from './dashboard.models';
import { DashboardWidgetPeriodRequest } from '../../service/requests/dashboard-request';

interface WidgetUpdate {
  widget: DashboardWidgetItem;
  response?: DashboardWidgetDataResponse;
  errorMessage?: string;
}

const DEFAULT_ERROR_MESSAGE = 'Nao foi possivel carregar o dashboard.';
const DEFAULT_WIDGET_ERROR = 'Nao foi possivel carregar este widget.';

@Injectable()
export class DashboardService {
  private api = inject(DashboardApiService);
  private destroyRef = inject(DestroyRef);
  private stateSubject = new BehaviorSubject<DashboardState>({
    status: DashboardStateStatus.LOADING,
    widgets: [],
  });
  private cache?: DashboardState;
  private loadSubscription?: Subscription;
  private readonly concurrency = 4;
  private widgetsSnapshot: DashboardWidgetItem[] = [];
  private periodOverride: DashboardWidgetPeriodRequest | null = null;

  state$ = this.stateSubject.asObservable();

  loadDashboard(force = false): Observable<DashboardState> {
    if (!force && this.cache) {
      this.stateSubject.next(this.cache);
      return this.state$;
    }

    this.stateSubject.next({ status: DashboardStateStatus.LOADING, widgets: [] });

    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.api
      .getWidgets()
      .pipe(
        map((widgets) => [...widgets].sort((a, b) => a.order - b.order)),
        tap((widgets) => {
          const viewModels = widgets.map((widget, index) =>
            this.createLoadingWidget(widget, index)
          );
          viewModels.sort((a, b) => a.order - b.order);
          this.widgetsSnapshot = widgets;
          this.stateSubject.next({
            status: DashboardStateStatus.READY,
            widgets: viewModels,
          });
          this.cache = this.stateSubject.value;
        }),
        switchMap((widgets) => this.buildWidgetRequestsStream(widgets)),
        tap((update) => this.applyWidgetUpdate(update)),
        catchError(() => {
          this.stateSubject.next({
            status: DashboardStateStatus.ERROR,
            widgets: [],
            errorMessage: DEFAULT_ERROR_MESSAGE,
          });
          this.cache = this.stateSubject.value;
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    return this.state$;
  }

  reloadDashboard(): void {
    this.cache = undefined;
    this.loadDashboard(true);
  }

  setPeriod(period: DashboardWidgetPeriodRequest | null): void {
    const same =
      (!period && !this.periodOverride) ||
      (period &&
        this.periodOverride &&
        period.from === this.periodOverride.from &&
        period.to === this.periodOverride.to);

    if (same) {
      return;
    }

    this.periodOverride = period;
    this.cache = undefined;
    this.refreshWidgetsData();
  }

  reloadWidget(widget: DashboardWidgetViewModel): void {
    this.setWidgetLoading(widget);
    this.fetchWidgetData(widget.widget)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => this.applyWidgetUpdate(update));
  }

  private fetchWidgetData(widget: DashboardWidgetItem): Observable<WidgetUpdate> {
    return this.api
      .getWidgetData(buildWidgetRequest(widget, this.periodOverride))
      .pipe(
        map((response) => ({ widget, response })),
      catchError(() =>
        of({
          widget,
          errorMessage: DEFAULT_WIDGET_ERROR,
        })
      )
    );
  }

  private buildWidgetRequestsStream(
    widgets: DashboardWidgetItem[]
  ): Observable<WidgetUpdate> {
    return from(widgets).pipe(
      mergeMap((widget) => this.fetchWidgetData(widget), this.concurrency)
    );
  }

  private refreshWidgetsData(): void {
    if (!this.widgetsSnapshot.length) {
      this.loadDashboard(true);
      return;
    }

    this.setAllWidgetsLoading();

    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.buildWidgetRequestsStream(
      this.widgetsSnapshot
    )
      .pipe(
        tap((update) => this.applyWidgetUpdate(update)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private createLoadingWidget(
    widget: DashboardWidgetItem,
    index: number
  ): DashboardWidgetViewModel {
    return {
      key: `${widget.enum}-${widget.order}-${index}`,
      type: widget.type,
      order: widget.order,
      status: DashboardWidgetStatus.LOADING,
      widget,
    };
  }

  private setWidgetLoading(widget: DashboardWidgetViewModel): void {
    const current = this.stateSubject.value;
    const widgets = current.widgets.map((item) =>
      item.key === widget.key ? { ...item, status: DashboardWidgetStatus.LOADING, errorMessage: undefined } : item
    );
    this.stateSubject.next({ ...current, widgets });
    this.cache = this.stateSubject.value;
  }

  private setAllWidgetsLoading(): void {
    const current = this.stateSubject.value;
    const widgets = current.widgets.map((item) => ({
      ...item,
      status: DashboardWidgetStatus.LOADING,
      errorMessage: undefined,
    }));
    this.stateSubject.next({ ...current, widgets });
    this.cache = this.stateSubject.value;
  }

  private applyWidgetUpdate(update: WidgetUpdate): void {
    const current = this.stateSubject.value;
    const widgets = current.widgets.map((item) => {
      if (item.widget.enum !== update.widget.enum || item.order !== update.widget.order) {
        return item;
      }
      if (update.errorMessage) {
        return {
          ...item,
          status: DashboardWidgetStatus.ERROR,
          errorMessage: update.errorMessage,
        };
      }

      if (update.response) {
        const mapped = mapWidgetResponseToViewModel(
          item.widget,
          update.response
        );
        const returnItem = {
          ...item,
          status: DashboardWidgetStatus.READY,
          type: update.response.type,
          errorMessage: undefined,
          showPeriod: update.response.meta?.show_period ?? false,
          ...mapped,
        };
        return returnItem
      }

      return item;
    }) as DashboardWidgetViewModel[];

    this.stateSubject.next({
      ...current,
      status: DashboardStateStatus.READY,
      widgets,
    });
    this.cache = this.stateSubject.value;
  }
}
