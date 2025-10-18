import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { SkuListService } from './sku-list.service';
import { Column } from '../../../shared/components/table/models/column';
import { SkuFormDialogComponent } from '../sku-form-dialog/sku-form-dialog.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { GetSkuResponse } from '../../../service/responses/products-response';

@Component({
  selector: 'app-sku-list',
  imports: [TableComponent, SkuFormDialogComponent, CommonModule],
  templateUrl: './sku-list.component.html',
  styleUrl: './sku-list.component.scss',
  providers: [SkuListService, CurrencyPipe],
})
export class SkuListComponent {
  @ViewChild('skuDialog') skuDialog?: SkuFormDialogComponent;
  @Output() onSubmitSuccess = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<GetSkuResponse>();
  @Input() disableCreate: boolean = false;
  @Input() productId!: number;
  @Input() skus: GetSkuResponse[] = [];
  @Input() showOnlyTable: boolean = false;

  service: SkuListService = inject(SkuListService);

  columns: Column[] = this.service.getColumns();
}
