import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardChartComponent } from './dashboard-chart.component';

@Component({
  selector: 'app-dashboard-bar-chart',
  imports: [DashboardChartComponent],
  template: `
    <app-dashboard-chart
      [title]="title"
      [description]="description"
      [periodLabel]="periodLabel"
      [options]="options"
      [showPeriod]="showPeriod"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBarChartComponent {
  @Input() title = '';
  @Input() description?: string;
  @Input() periodLabel?: string | null;
  @Input() options: Highcharts.Options = {};
  @Input() showPeriod: boolean = false;
}
