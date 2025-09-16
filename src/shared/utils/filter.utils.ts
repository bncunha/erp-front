import { cleanNulls } from './clean-nulls';

export class FilterUtils {
  private pageName = window.location.pathname;
  private savedKey = `filter-${this.pageName}`;

  getFilters(): any {
    const filters = sessionStorage.getItem(this.savedKey);
    return filters ? JSON.parse(filters) : {};
  }

  setFilters(filters: any): void {
    const formatedFilters = cleanNulls(filters);
    sessionStorage.setItem(this.savedKey, JSON.stringify(formatedFilters));
    return formatedFilters;
  }

  clearFilters(): void {
    sessionStorage.removeItem(this.savedKey);
  }
}
