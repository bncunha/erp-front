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
}
