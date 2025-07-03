import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryHistoryService } from './inventory-history.service';

@Component({
  selector: 'app-inventory-history',
  imports: [TableComponent, SharedModule],
  templateUrl: './inventory-history.component.html',
  styleUrl: './inventory-history.component.scss',
  providers: [InventoryHistoryService],
})
export class InventoryHistoryComponent {
  service = inject(InventoryHistoryService);

  columns = this.service.getColumns();
}
