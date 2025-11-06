import { cleanNulls } from './clean-nulls';
import { deepClone } from './deep-clone.utis';
import { ParamMap } from '@angular/router';

export class FilterUtils {
  private pageName = window.location.pathname;
  private savedKey = `filter-${this.pageName}`;

  getFilters(): any {
    const filters = sessionStorage.getItem(this.savedKey);
    return filters ? JSON.parse(filters) : {};
  }

  setFilters(filters: any): any {
    const clone = deepClone(filters);
    const formatedFilters = cleanNulls(clone);
    sessionStorage.setItem(this.savedKey, JSON.stringify(formatedFilters));
    return formatedFilters;
  }

  clearFilters(): void {
    sessionStorage.removeItem(this.savedKey);
  }

  getFiltersFromQueryParams(paramMap: ParamMap): any {
    const params: any = {};

    for (const key of paramMap.keys) {
      const values = paramMap.getAll(key);
      if (values.length > 1) {
        params[key] = values;
      } else {
        const value = paramMap.get(key);
        if (value !== null) {
          params[key] = value;
        }
      }
    }

    return params;
  }
}
