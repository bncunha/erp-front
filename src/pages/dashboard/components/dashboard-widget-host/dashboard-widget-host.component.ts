import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { DashboardWidgetViewModel } from '../../dashboard.models';
import { DashboardWidgetType } from '../../../../service/responses/dashboard-response';
import { DashboardBarChartComponent } from '../dashboard-chart/dashboard-bar-chart.component';
import { DashboardLineChartComponent } from '../dashboard-chart/dashboard-line-chart.component';
import { DashboardPieChartComponent } from '../dashboard-chart/dashboard-pie-chart.component';
import { DashboardWidgetCardComponent } from '../dashboard-widget-card/dashboard-widget-card.component';
import { DashboardWidgetTableComponent } from '../dashboard-widget-table/dashboard-widget-table.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DashboardSkeletonComponent } from '../dashboard-skeleton/dashboard-skeleton.component';

@Component({
  selector: 'app-dashboard-widget-host',
  imports: [
    SharedModule,
    DashboardSkeletonComponent,
    DashboardBarChartComponent,
    DashboardLineChartComponent,
    DashboardPieChartComponent,
    DashboardWidgetCardComponent,
    DashboardWidgetTableComponent,
    CardComponent
  ],
  templateUrl: './dashboard-widget-host.component.html',
  styleUrl: './dashboard-widget-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-type]': 'widget?.type',
  },
})
export class DashboardWidgetHostComponent {
  @Input({ required: true }) widget!: DashboardWidgetViewModel;
  @Output() retry = new EventEmitter<DashboardWidgetViewModel>();

  readonly widgetType = DashboardWidgetType;
}
