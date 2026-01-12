export interface DashboardWidgetPeriodRequest {
  from: string;
  to: string;
}

export interface DashboardWidgetFiltersRequest {
  reseller_id?: number;
  product_id?: number;
}

export interface DashboardWidgetDataRequest {
  enum: string;
  period: DashboardWidgetPeriodRequest;
  filters?: DashboardWidgetFiltersRequest | null;
}
