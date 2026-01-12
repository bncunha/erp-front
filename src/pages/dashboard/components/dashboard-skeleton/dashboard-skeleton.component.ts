import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DashboardWidgetType } from '../../../../service/responses/dashboard-response';

@Component({
  selector: 'app-dashboard-skeleton',
  imports: [SharedModule, CardComponent],
  templateUrl: './dashboard-skeleton.component.html',
  styleUrl: './dashboard-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSkeletonComponent {
  @Input({ required: true }) type!: DashboardWidgetType;

  readonly widgetType = DashboardWidgetType;
  readonly tableRows = Array.from({ length: 4 }, (_, index) => index);

  get isChart(): boolean {
    return (
      this.type === DashboardWidgetType.BAR ||
      this.type === DashboardWidgetType.LINE ||
      this.type === DashboardWidgetType.PIE
    );
  }
}
