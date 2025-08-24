import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryListService } from './inventory-list.service';
import { Column } from '../../../shared/components/table/models/column';
import { InventoryFormDialogComponent } from '../inventory-form-dialog/inventory-form-dialog.component';

@Component({
  selector: 'app-inventory-list',
  imports: [SharedModule, InventoryFormDialogComponent],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
  providers: [InventoryListService],
})
export class InventoryListComponent {
  service: InventoryListService = inject(InventoryListService);

  items = this.service.getAllItems();
  columns: Column[] = this.service.getColums();
}
