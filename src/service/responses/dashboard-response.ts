export enum DashboardWidgetType {
  CARD = 'CARD',
  TABLE = 'TABLE',
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
}

export interface DashboardWidgetPeriod {
  from: string;
  to: string;
}

export interface DashboardWidgetFilters {
  reseller_id?: number;
  product_id?: number;
}

export interface DashboardWidgetItem {
  enum: string;
  type: DashboardWidgetType;
  order: number;
  title?: string;
  description?: string;
  default_period?: DashboardWidgetPeriod;
  default_filters?: DashboardWidgetFilters;
}

export interface DashboardWidgetMeta {
  title?: string;
  description?: string;
  period?: DashboardWidgetPeriod;
  show_period?: boolean;
}

export interface DashboardChartSeries {
  name: string;
  values: number[];
}

export interface DashboardBarLineData {
  labels: string[];
  series: DashboardChartSeries[];
}

export interface DashboardPieData {
  labels: string[];
  values: number[];
}

export interface DashboardTableColumn {
  label: string;
  key: string;
}

export type DashboardTableRow = Record<string, string | number | null>;

export interface DashboardTableData {
  columns: DashboardTableColumn[];
  rows: DashboardTableRow[];
}

export interface DashboardCardData {
  value: string | number;
  delta?: number;
  delta_label?: string;
  prefix?: string;
  suffix?: string;
  secondary_value?: string | number;
}

export type DashboardWidgetDataPayload =
  | DashboardBarLineData
  | DashboardPieData
  | DashboardTableData
  | DashboardCardData;

export interface DashboardWidgetDataResponse<
  TData extends DashboardWidgetDataPayload = DashboardWidgetDataPayload,
> {
  enum: string;
  type: DashboardWidgetType;
  meta?: DashboardWidgetMeta;
  data: TData;
}
