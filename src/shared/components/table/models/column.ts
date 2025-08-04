export interface Column {
  header: string;
  field: string;
  valueFn?: (item: any) => string;
}
