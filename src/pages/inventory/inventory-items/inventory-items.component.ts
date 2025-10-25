import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryItemsService } from './inventory-items.service';
import { InventoryFormDialogComponent } from '../inventory-form-dialog/inventory-form-dialog.component';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { GetInventoryItemsResponse } from '../../../service/responses/inventory-response';
import { InventoryTypeEnum } from '../../../enums/inventory-type.enum';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-inventory-items',
  imports: [SharedModule, InventoryFormDialogComponent],
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss',
  providers: [InventoryItemsService],
})
export class InventoryItemsComponent implements OnChanges {
  @ViewChild(InventoryFormDialogComponent)
  formDialog?: InventoryFormDialogComponent;

  @Input() inventoryId: number | null = null;
  @Output() transactionCompleted = new EventEmitter<void>();

  private filtersSubject = new BehaviorSubject<InventoryItemsFilters>({
    term: '',
    availability: 'all',
  });
  private paginationSubject = new BehaviorSubject<InventoryPaginationState>({
    page: 1,
    pageSize: 12,
  });

  service: InventoryItemsService = inject(InventoryItemsService);

  filters: InventoryItemsFilters = this.filtersSubject.value;

  readonly availabilityOptions: InventoryAvailabilityOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Com estoque', value: 'in_stock' },
    { label: 'Sem estoque', value: 'out_of_stock' },
  ];

  readonly isLoading$ = this.service.isLoading$;
  readonly filteredItems$ = combineLatest([
    this.service.items$,
    this.filtersSubject.asObservable(),
  ]).pipe(map(([items, filters]) => this.filterItems(items, filters)));
  readonly paginatedItems$ = combineLatest([
    this.filteredItems$,
    this.paginationSubject.asObservable(),
  ]).pipe(
    map(([items, pagination]) => {
      const totalItems = items.length;
      const pageSize = pagination.pageSize;
      const totalPages =
        totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
      const currentPage = Math.min(pagination.page, totalPages);
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const pagedItems = items.slice(start, end);

      return {
        items: pagedItems,
        totalItems,
        totalPages,
        pageSize,
        page: totalItems === 0 ? 1 : currentPage,
        first: pagedItems.length > 0 ? start + 1 : 0,
        last: pagedItems.length > 0 ? start + pagedItems.length : 0,
      };
    })
  );

  ngOnChanges(changes: SimpleChanges): void {
    if ('inventoryId' in changes) {
      this.service.setInventoryId(this.inventoryId);
      this.clearFilters();
    }
  }

  get hasFilters(): boolean {
    return (
      !!this.filters.term?.trim() || this.filters.availability !== 'all'
    );
  }

  trackByInventoryItem = (_: number, item: GetInventoryItemsResponse) =>
    item.inventory_item_id;
  protected readonly InventoryTypeEnum = InventoryTypeEnum;

  onSearchChange(term: string) {
    this.updateFilters({ term });
  }

  onAvailabilityChange(value: InventoryAvailability) {
    this.updateFilters({ availability: value });
  }

  clearFilters() {
    this.filters = { term: '', availability: 'all' };
    this.filtersSubject.next(this.filters);
    this.resetPagination();
  }

  clearSearch() {
    if (!this.filters.term) {
      return;
    }
    this.updateFilters({ term: '' });
  }

  clearAvailability() {
    if (this.filters.availability === 'all') {
      return;
    }
    this.updateFilters({ availability: 'all' });
  }

  openTransaction(
    type: InventoryTypeEnum,
    product: GetInventoryItemsResponse
  ) {
    if (!this.formDialog || this.inventoryId === null) {
      return;
    }

    this.formDialog.open({
      type,
      inventoryId: this.inventoryId,
      product,
    });
  }

  handleTransactionSuccess() {
    this.service.reload();
    this.transactionCompleted.emit();
  }

  onPageChange(state: PaginatorState) {
    const pageSize = state.rows ?? this.paginationSubject.value.pageSize;
    const pageIndex = (state.page ?? 0) + 1;
    this.paginationSubject.next({
      page: pageIndex,
      pageSize,
    });
  }

  private updateFilters(filters: Partial<InventoryItemsFilters>) {
    this.filters = {
      ...this.filters,
      ...filters,
      term: filters.term !== undefined ? filters.term.trim() : this.filters.term,
    };
    this.filtersSubject.next(this.filters);
    this.resetPagination();
  }

  private filterItems(
    items: GetInventoryItemsResponse[],
    filters: InventoryItemsFilters
  ): GetInventoryItemsResponse[] {
    const term = filters.term.trim().toLowerCase();
    let filtered = [...items];

    if (term) {
      filtered = filtered.filter((item) =>
        `${item.product_name} ${item.sku_code}`.toLowerCase().includes(term)
      );
    }

    if (filters.availability === 'in_stock') {
      filtered = filtered.filter((item) => item.quantity > 0);
    } else if (filters.availability === 'out_of_stock') {
      filtered = filtered.filter((item) => item.quantity <= 0);
    }

    return filtered;
  }

  private resetPagination() {
    this.paginationSubject.next({
      ...this.paginationSubject.value,
      page: 1,
    });
  }
}

type InventoryAvailability = 'all' | 'in_stock' | 'out_of_stock';

interface InventoryAvailabilityOption {
  label: string;
  value: InventoryAvailability;
}

interface InventoryItemsFilters {
  term: string;
  availability: InventoryAvailability;
}

interface InventoryPaginationState {
  page: number;
  pageSize: number;
}
