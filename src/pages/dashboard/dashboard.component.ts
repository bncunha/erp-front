import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../shared/shared.module';
import { DashboardService } from './dashboard.service';
import { DashboardWidgetHostComponent } from './components/dashboard-widget-host/dashboard-widget-host.component';
import { DashboardState, DashboardWidgetViewModel } from './dashboard.models';
import { DashboardWidgetPeriodRequest } from '../../service/requests/dashboard-request';
import { DateUtils } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-dashboard',
  imports: [
    SharedModule,
    DashboardWidgetHostComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DashboardService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private service = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  periodForm = new FormGroup({
    from: new FormControl<Date | null>(null),
    to: new FormControl<Date | null>(null),
  }, { validators: this.periodValidator() });

  state$: Observable<DashboardState> = this.service.loadDashboard();

  constructor() {
    this.periodForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe((value) => {
        if (this.periodForm.invalid) {
          return;
        }

        const from = value.from ?? null;
        const to = value.to ?? null;

        if (!from && !to) {
          this.service.setPeriod(null);
          return;
        }

        if (from && to) {
          const period = this.buildPeriodRequest(from, to);
          if (period) {
            this.service.setPeriod(period);
          }
        }
      });
  }

  reloadDashboard(): void {
    this.service.reloadDashboard();
  }

  reloadWidget(widget: DashboardWidgetViewModel): void {
    this.service.reloadWidget(widget);
  }

  clearPeriod(): void {
    this.periodForm.reset();
  }

  private buildPeriodRequest(
    from: Date,
    to: Date
  ): DashboardWidgetPeriodRequest | null {
    const formattedFrom = DateUtils.formatDate(from);
    const formattedTo = DateUtils.formatDate(to);

    if (!formattedFrom || !formattedTo) {
      return null;
    }

    return {
      from: formattedFrom,
      to: formattedTo,
    };
  }

  private periodValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const from = control.get('from')?.value as Date | null;
      const to = control.get('to')?.value as Date | null;

      if (!from || !to) {
        return null;
      }
      return to.getTime() < from.getTime()
        ? { endAfterStart: true }
        : null;
    };
  }
}
