import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ItemsListService } from './items-list.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import {
  GetProductResponse,
  GetSkuResponse,
} from '../../../service/responses/products-response';
import { deepClone } from '../../../shared/utils/deep-clone.utis';

@Component({
  selector: 'app-items-list',
  imports: [SharedModule, CardComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
  providers: [ItemsListService],
})
export class ItemsListComponent implements OnChanges {
  @Output() onQuantityChange = new EventEmitter<{
    item: GetSkuResponse;
    quantity: number;
  }>();

  @Input() items: GetSkuResponse[] = [];
  service = inject(ItemsListService);

  private _allItems: GetSkuResponse[] = [];

  ngOnChanges(): void {
    this._allItems = deepClone(this.items);
  }

  onSearch(event: any) {
    this.items = this.service.filterByText(this._allItems, event.target.value);
  }
}
