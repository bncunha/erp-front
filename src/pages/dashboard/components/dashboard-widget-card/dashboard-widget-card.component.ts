import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DashboardCardViewModel } from '../../dashboard.models';

@Component({
  selector: 'app-dashboard-widget-card',
  imports: [SharedModule, CardComponent],
  templateUrl: './dashboard-widget-card.component.html',
  styleUrl: './dashboard-widget-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWidgetCardComponent {
  @Input() card?: DashboardCardViewModel | null;
  @Input() showPeriod: boolean = false;

  formatValue(value: string | number | undefined): string {
    if (value === undefined || value === null) {
      return '-';
    }
    if (typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR').format(value);
    }
    return value;
  }

  getDeltaClass(delta?: number): string {
    if (delta === undefined || delta === null) {
      return '';
    }
    return delta >= 0
      ? 'dashboard-card__delta--positive'
      : 'dashboard-card__delta--negative';
  }
}
