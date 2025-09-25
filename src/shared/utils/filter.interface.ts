export interface FilterComponent {
  getFilters(): any;
  setFilters(filters: any): void;
  cleanFilters(form: any): void;
}
