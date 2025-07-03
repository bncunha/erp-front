import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InventoryService } from './inventory.service';
import { Column } from '../../shared/components/table/models/column';
import { TabsModule } from 'primeng/tabs';
import { InventoryListComponent } from './inventory-list/inventory-list.component';

@Component({
  selector: 'app-inventory',
  imports: [SharedModule, TabsModule, InventoryListComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
  providers: [InventoryService],
})
export class InventoryComponent {
  service: InventoryService = inject(InventoryService);
}
