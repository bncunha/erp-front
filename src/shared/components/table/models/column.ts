export interface Column {
  header: string;
  field: string;
  sortable?: boolean;
  styleFn?: (item: any) => any;
  valueFn?: (item: any) => string;
  badgeClassFn?: (item: any) => string;
  badgeLabelFn?: (item: any) => string;
}
