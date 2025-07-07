import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ItemsListService } from './items-list.service';
import { ItemsFormDialogComponent } from '../items-form-dialog/items-form-dialog.component';

@Component({
  selector: 'app-items-list',
  imports: [SharedModule, ItemsFormDialogComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
  providers: [ItemsListService],
})
export class ItemsListComponent {
  service = inject(ItemsListService);

  columns = this.service.getColumns();
}
