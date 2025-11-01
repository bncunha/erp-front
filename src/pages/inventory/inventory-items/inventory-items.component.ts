import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  OnChanges,
  SimpleChanges,
  DestroyRef,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryItemsService } from './inventory-items.service';
import { InventoryFormDialogComponent } from '../inventory-form-dialog/inventory-form-dialog.component';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  GetInventoryItemsResponse,
  GetInventorySummaryResponse,
} from '../../../service/responses/inventory-response';
import { InventoryTypeEnum } from '../../../enums/inventory-type.enum';
import { PaginatorState } from 'primeng/paginator';
import { InventoryFormDialogMultipleComponent } from '../inventory-form-dialog-multiple/inventory-form-dialog-multiple.component';
import { InventoryFormDialogLoteComponent } from '../inventory-form-dialog-lote/inventory-form-dialog-lote.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-inventory-items',
  imports: [
    SharedModule,
    InventoryFormDialogComponent,
    InventoryFormDialogMultipleComponent,
    InventoryFormDialogLoteComponent,
  ],
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss',
  providers: [InventoryItemsService],
})
export class InventoryItemsComponent implements OnChanges {
  @ViewChild(InventoryFormDialogComponent)
  formDialog?: InventoryFormDialogComponent;
  @ViewChild(InventoryFormDialogMultipleComponent)
  multipleFormDialog?: InventoryFormDialogMultipleComponent;
  @ViewChild(InventoryFormDialogLoteComponent)
  batchFormDialog?: InventoryFormDialogLoteComponent;
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  @Input() inventoryId: number | null = null;
  @Input() inventorySummary: GetInventorySummaryResponse | null = null;
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
  private allItemsMap = new Map<number, GetInventoryItemsResponse>();
  private filteredItemsSnapshot: GetInventoryItemsResponse[] = [];
  selectedProductIds = new Set<number>();
  selectAllChecked = false;
  hasVisibleProducts = false;
  batchMenuItems: MenuItem[] = [];

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

  constructor() {
    this.batchMenuItems = [
      {
        label: 'Entrada',
        icon: 'pi pi-arrow-down-left',
        command: () => this.openBatchTransaction(InventoryTypeEnum.IN),
      },
      {
        label: 'Saída',
        icon: 'pi pi-arrow-up-right',
        command: () => this.openBatchTransaction(InventoryTypeEnum.OUT),
      },
      {
        label: 'Transferência',
        icon: 'pi pi-arrow-right-arrow-left',
        command: () => this.openBatchTransaction(InventoryTypeEnum.TRANSFER),
      },
    ];

    this.service.items$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.allItemsMap = new Map(
          items.map((item) => [item.inventory_item_id, item])
        );
        this.removeUnavailableSelections();
      });

    this.filteredItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.filteredItemsSnapshot = items;
        this.hasVisibleProducts = items.length > 0;
        this.updateSelectAllState();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('inventoryId' in changes) {
      this.service.setInventoryId(this.inventoryId);
      this.clearFilters();
      this.clearSelection();
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

  get inventoryDisplayName(): string | null {
    if (!this.inventorySummary) {
      return null;
    }

    return `${this.inventorySummary.user_name} - ${this.inventorySummary.inventory_type}`;
  }

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

  openMultipleTransaction() {
    if (!this.multipleFormDialog || this.inventoryId === null) {
      return;
    }

    this.multipleFormDialog.open({
      inventoryId: this.inventoryId,
      inventoryName: this.inventoryDisplayName ?? '-',
    });
  }

  openBatchTransaction(type: InventoryTypeEnum) {
    if (!this.batchFormDialog || this.inventoryId === null) {
      return;
    }

    const selectedProducts = this.getSelectedProducts();
    if (selectedProducts.length === 0) {
      this.toastService.showError(
        'Selecione ao menos um produto para movimentar em lote.',
        'Nenhum produto selecionado'
      );
      return;
    }

    let productsForDialog = selectedProducts;

    if (
      type === InventoryTypeEnum.OUT ||
      type === InventoryTypeEnum.TRANSFER
    ) {
      productsForDialog = selectedProducts.filter(
        (product) => product.quantity > 0
      );

      if (productsForDialog.length === 0) {
        this.toastService.showError(
          'Nenhum dos produtos selecionados possui estoque disponível para esta movimentação.',
          'Estoque indisponível'
        );
        return;
      }
    }

    this.batchFormDialog.open({
      type,
      inventoryId: this.inventoryId,
      inventoryName: this.inventoryDisplayName ?? '-',
      products: productsForDialog,
    });
  }

  handleTransactionSuccess() {
    this.service.reload();
    this.transactionCompleted.emit();
    this.clearSelection();
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

  onSelectAllChange(event: CheckboxChangeEvent) {
    const checked = !!event.checked;
    this.toggleSelectAll(checked);
  }

  onProductSelectionChange(
    product: GetInventoryItemsResponse,
    event: CheckboxChangeEvent
  ) {
    const checked = !!event.checked;
    if (checked) {
      this.selectedProductIds.add(product.inventory_item_id);
    } else {
      this.selectedProductIds.delete(product.inventory_item_id);
    }

    this.updateSelectAllState();
  }

  toggleProductSelection(product: GetInventoryItemsResponse) {
    if (this.selectedProductIds.has(product.inventory_item_id)) {
      this.selectedProductIds.delete(product.inventory_item_id);
    } else {
      this.selectedProductIds.add(product.inventory_item_id);
    }

    this.updateSelectAllState();
  }

  isProductSelected(productId: number): boolean {
    return this.selectedProductIds.has(productId);
  }

  get selectedProductsCount(): number {
    return this.selectedProductIds.size;
  }

  getSelectedProducts(): GetInventoryItemsResponse[] {
    return Array.from(this.selectedProductIds)
      .map((id) => this.allItemsMap.get(id))
      .filter((item): item is GetInventoryItemsResponse => !!item);
  }

  clearSelection() {
    this.selectedProductIds.clear();
    this.selectAllChecked = false;
  }

  private toggleSelectAll(checked: boolean) {
    const targetItems = this.filteredItemsSnapshot;

    if (targetItems.length === 0) {
      this.clearSelection();
      return;
    }

    if (checked) {
      targetItems.forEach((item) =>
        this.selectedProductIds.add(item.inventory_item_id)
      );
    } else {
      targetItems.forEach((item) =>
        this.selectedProductIds.delete(item.inventory_item_id)
      );
    }
    this.updateSelectAllState();
  }

  private updateSelectAllState() {
    if (this.filteredItemsSnapshot.length === 0) {
      this.selectAllChecked = false;
      return;
    }

    this.selectAllChecked = this.filteredItemsSnapshot.every((item) =>
      this.selectedProductIds.has(item.inventory_item_id)
    );
  }

  private removeUnavailableSelections() {
    const availableIds = new Set(this.allItemsMap.keys());
    const toRemove: number[] = [];

    this.selectedProductIds.forEach((id) => {
      if (!availableIds.has(id)) {
        toRemove.push(id);
      }
    });

    if (toRemove.length > 0) {
      toRemove.forEach((id) => this.selectedProductIds.delete(id));
      this.updateSelectAllState();
    }
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
