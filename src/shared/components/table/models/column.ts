export interface Column {
  header: string;
  field: string;
  styleFn?: (item: any) => any;
  valueFn?: (item: any) => string;
}
