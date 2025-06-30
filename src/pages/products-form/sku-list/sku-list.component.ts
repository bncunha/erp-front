import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { SkuListService } from './sku-list.service';
import { Column } from '../../../shared/components/table/models/column';
import { SkuFormDialogComponent } from '../sku-form-dialog/sku-form-dialog.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sku-list',
  imports: [TableComponent, SkuFormDialogComponent, CommonModule],
  templateUrl: './sku-list.component.html',
  styleUrl: './sku-list.component.scss',
  providers: [SkuListService],
})
export class SkuListComponent {
  service: SkuListService = inject(SkuListService);

  columns: Column[] = this.service.getColumns();
}
