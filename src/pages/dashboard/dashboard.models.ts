import { DashboardWidgetItem, DashboardWidgetPeriod, DashboardWidgetType } from '../../service/responses/dashboard-response';
import { Column } from '../../shared/components/table/models/column';
import * as Highcharts from 'highcharts';

export enum DashboardStateStatus  {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export enum DashboardWidgetStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export interface DashboardCardViewModel {
  title: string;
  description?: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  prefix?: string;
  suffix?: string;
  secondaryValue?: string | number;
  period?: DashboardWidgetPeriod;
}

export interface DashboardChartViewModel {
  title: string;
  description?: string;
  options: Highcharts.Options;
  period?: DashboardWidgetPeriod;
}

export interface DashboardTableViewModel {
  title: string;
  description?: string;
  columns: Column[];
  rows: Array<Record<string, string | number | null>>;
  period?: DashboardWidgetPeriod;
}

export interface DashboardWidgetViewModel {
  key: string;
  type: DashboardWidgetType;
  order: number;
  status: DashboardWidgetStatus;
  widget: DashboardWidgetItem;
  card?: DashboardCardViewModel;
  chart?: DashboardChartViewModel;
  table?: DashboardTableViewModel;
  errorMessage?: string;
  showPeriod?: boolean;
}

export interface DashboardState {
  status: DashboardStateStatus;
  widgets: DashboardWidgetViewModel[];
  errorMessage?: string;
}
