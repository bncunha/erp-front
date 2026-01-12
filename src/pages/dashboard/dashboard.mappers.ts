import { subDays } from 'date-fns';
import * as Highcharts from 'highcharts';
import {
  DashboardBarLineData,
  DashboardCardData,
  DashboardPieData,
  DashboardTableData,
  DashboardWidgetDataResponse,
  DashboardWidgetItem,
  DashboardWidgetPeriod,
  DashboardWidgetType,
} from '../../service/responses/dashboard-response';
import {
  DashboardWidgetDataRequest,
  DashboardWidgetPeriodRequest,
} from '../../service/requests/dashboard-request';
import { DateUtils } from '../../shared/utils/date.utils';
import {
  DashboardCardViewModel,
  DashboardChartViewModel,
  DashboardTableViewModel,
  DashboardWidgetViewModel,
} from './dashboard.models';

const DEFAULT_PERIOD_DAYS = 30;

const buildDefaultPeriod = (): DashboardWidgetPeriodRequest => {
  const to = new Date();
  const from = subDays(to, DEFAULT_PERIOD_DAYS);
  return {
    from: DateUtils.formatDate(from),
    to: DateUtils.formatDate(to),
  };
};

export const buildWidgetRequest = (
  widget: DashboardWidgetItem,
  overridePeriod?: DashboardWidgetPeriodRequest | null
): DashboardWidgetDataRequest => {
  return {
    enum: widget.enum,
    period: overridePeriod ?? widget.default_period ?? buildDefaultPeriod(),
    filters: widget.default_filters ?? null,
  };
};

const resolveTitle = (
  widget: DashboardWidgetItem,
  meta?: { title?: string }
): string => {
  return meta?.title || widget.title || widget.enum;
};

const resolveDescription = (
  widget: DashboardWidgetItem,
  meta?: { description?: string }
): string | undefined => {
  return meta?.description || widget.description;
};

const resolvePeriod = (
  widget: DashboardWidgetItem,
  meta?: { period?: DashboardWidgetPeriod }
): DashboardWidgetPeriod | undefined => {
  return meta?.period || widget.default_period;
};

const mapBarLineOptions = (
  data: DashboardBarLineData,
  type: 'bar' | 'line'
): Highcharts.Options => {
  return {
    chart: {
      type,
      backgroundColor: 'transparent',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: data.labels ?? [],
      title: { text: undefined },
    },
    yAxis: {
      title: { text: undefined },
    },
    legend: {
      enabled: true,
    },
    series: (data.series ?? []).map((series) => ({
      type,
      name: series.name,
      data: series.values ?? [],
    })) as Highcharts.SeriesOptionsType[],
    credits: { enabled: false },
  };
};

const mapPieOptions = (data: DashboardPieData): Highcharts.Options => {
  const labels = data.labels ?? [];
  const values = data.values ?? [];
  return {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%',
        },
      },
    },
    series: [
      {
        type: 'pie',
        data: labels.map((label, index) => ({
          name: label,
          y: values[index] ?? 0,
        })),
      },
    ],
    credits: { enabled: false },
  };
};

const mapCardViewModel = (
  widget: DashboardWidgetItem,
  response: DashboardWidgetDataResponse<DashboardCardData>
): DashboardCardViewModel => {
  const data = response.data;
  return {
    title: resolveTitle(widget, response.meta),
    description: resolveDescription(widget, response.meta),
    value: data?.value ?? '-',
    delta: data?.delta,
    deltaLabel: data?.delta_label,
    prefix: data?.prefix,
    suffix: data?.suffix,
    secondaryValue: data?.secondary_value,
    period: resolvePeriod(widget, response.meta),
  };
};

const mapTableViewModel = (
  widget: DashboardWidgetItem,
  response: DashboardWidgetDataResponse<DashboardTableData>
): DashboardTableViewModel => {
  const data = response.data;
  return {
    title: resolveTitle(widget, response.meta),
    description: resolveDescription(widget, response.meta),
    columns: (data?.columns ?? []).map((column) => ({
      header: column.label,
      field: column.key,
    })),
    rows: data?.rows ?? [],
    period: resolvePeriod(widget, response.meta),
  };
};

const mapChartViewModel = (
  widget: DashboardWidgetItem,
  response: DashboardWidgetDataResponse,
  options: Highcharts.Options
): DashboardChartViewModel => {
  return {
    title: resolveTitle(widget, response.meta),
    description: resolveDescription(widget, response.meta),
    options,
    period: resolvePeriod(widget, response.meta),
  };
};

export const mapWidgetResponseToViewModel = (
  widget: DashboardWidgetItem,
  response: DashboardWidgetDataResponse
): Partial<DashboardWidgetViewModel> => {
  switch (response.type) {
    case DashboardWidgetType.CARD:
      return {
        card: mapCardViewModel(
          widget,
          response as DashboardWidgetDataResponse<DashboardCardData>
        ),
      };
    case DashboardWidgetType.TABLE:
      return {
        table: mapTableViewModel(
          widget,
          response as DashboardWidgetDataResponse<DashboardTableData>
        ),
      };
    case DashboardWidgetType.BAR: {
      const options = mapBarLineOptions(
        response.data as DashboardBarLineData,
        'bar'
      );
      return {
        chart: mapChartViewModel(widget, response, options),
      };
    }
    case DashboardWidgetType.LINE: {
      const options = mapBarLineOptions(
        response.data as DashboardBarLineData,
        'line'
      );
      return {
        chart: mapChartViewModel(widget, response, options),
      };
    }
    case DashboardWidgetType.PIE: {
      const options = mapPieOptions(response.data as DashboardPieData);
      return {
        chart: mapChartViewModel(widget, response, options),
      };
    }
    default:
      return {};
  }
};
