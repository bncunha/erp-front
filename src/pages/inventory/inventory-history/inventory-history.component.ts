import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryHistoryService } from './inventory-history.service';
import { Observable, of } from 'rxjs';
import { GetTransactionHistoryResponse } from '../../../service/responses/inventory-response';

@Component({
  selector: 'app-inventory-history',
  imports: [TableComponent, SharedModule],
  templateUrl: './inventory-history.component.html',
  styleUrl: './inventory-history.component.scss',
  providers: [InventoryHistoryService],
})
export class InventoryHistoryComponent implements OnChanges {
  @Input() inventoryId: number | null = null;

  service = inject(InventoryHistoryService);

  columns = this.service.getColumns();
  history: Observable<GetTransactionHistoryResponse[]> = of([]);

  ngOnChanges(changes: SimpleChanges): void {
    if ('inventoryId' in changes) {
      this.history = this.service.getHistory(this.inventoryId);
    }
  }

  reload() {
    this.history = this.service.reload();
  }
}
