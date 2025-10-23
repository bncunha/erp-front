import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TabsModule } from 'primeng/tabs';
import { InventoryItemsComponent } from '../inventory-items/inventory-items.component';
import { InventoryHistoryComponent } from '../inventory-history/inventory-history.component';
import { InventoryDetailService } from './inventory-detail.service';

@Component({
  selector: 'app-inventory-detail',
  imports: [
    SharedModule,
    TabsModule,
    InventoryItemsComponent,
    InventoryHistoryComponent,
  ],
  templateUrl: './inventory-detail.component.html',
  styleUrl: './inventory-detail.component.scss',
  providers: [InventoryDetailService],
})
export class InventoryDetailComponent implements OnInit {
  @ViewChild(InventoryHistoryComponent)
  historyComponent?: InventoryHistoryComponent;

  private service = inject(InventoryDetailService);

  tabValue = '0';
  inventoryId: number | null = null;
  summary$ = this.service.summary$;
  isSummaryLoading$ = this.service.isSummaryLoading$;

  ngOnInit(): void {
    const inventoryId = this.service.resolveInventoryId();

    if (inventoryId === null) {
      return;
    }

    this.inventoryId = inventoryId;
    this.service.loadSummary(this.inventoryId);
  }

  handleTransactionCompleted() {
    if (this.inventoryId === null) {
      return;
    }

    this.service.loadSummary(this.inventoryId);
    this.historyComponent?.reload();
  }
}
