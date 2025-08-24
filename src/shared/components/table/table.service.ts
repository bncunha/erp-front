import { Injectable } from '@angular/core';
import { Column } from './models/column';
import { Table } from 'primeng/table';

@Injectable()
export class TableService {
  getFilterFields(columns: Column[]): string[] {
    return columns.map((c) => c.field);
  }

  onSearch(event: Event, primeTable: Table) {
    const target = event.target as HTMLInputElement;
    primeTable.filterGlobal(target.value, 'contains');
  }

  getInitialSearch(stateKey?: string): string {
    if (stateKey) {
      const saved = sessionStorage.getItem(stateKey);
      const filter = saved ? JSON.parse(saved) : null;
      return filter?.filters?.global?.value ?? '';
    }
    return '';
  }

  getValue(item: any, column: Column): string {
    if (column.valueFn) {
      return column.valueFn(item);
    }
    return item[column.field];
  }

  getStyle(item: any, column: Column): any {
    if (column.styleFn) {
      return column.styleFn(item);
    }
    return {};
  }
}
