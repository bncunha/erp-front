import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DashboardTableViewModel } from '../../dashboard.models';

@Component({
  selector: 'app-dashboard-widget-table',
  imports: [SharedModule, CardComponent],
  templateUrl: './dashboard-widget-table.component.html',
  styleUrl: './dashboard-widget-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWidgetTableComponent {
  @Input() table?: DashboardTableViewModel | null;
  @Input() showPeriod: boolean = false;

  constructor() {
  }
}
