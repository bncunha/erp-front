import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-dashboard-chart',
  imports: [CommonModule, HighchartsChartComponent, CardComponent],
  templateUrl: './dashboard-chart.component.html',
  styleUrl: './dashboard-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardChartComponent {
  @Input() title = '';
  @Input() description?: string;
  @Input() periodLabel?: string | null;
  @Input() showPeriod = false;
  @Input() options: Highcharts.Options = {};

  highcharts = Highcharts;
}
