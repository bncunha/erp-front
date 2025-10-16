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
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-items-list',
  imports: [SharedModule, CardComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
  providers: [ItemsListService],
})
export class ItemsListComponent implements OnChanges {
  @Input() items: GetSkuResponse[] = [];
  @Input() productsForm!: FormArray;
  @Input() isLoading: boolean = false;

  service = inject(ItemsListService);

  private _allItems: GetSkuResponse[] = [];
  showZero: boolean = false;
  private searchText: string = '';

  ngOnChanges(): void {
    this._allItems = deepClone(this.items);
    this.applyFilters();
  }

  onSearch(event: any) {
    this.searchText = event.target.value || '';
    this.applyFilters();
  }

  toggleShowZero() {
    this.showZero = !this.showZero;
    this.applyFilters();
  }

  private applyFilters() {
    let result = this.service.filterByText(this._allItems, this.searchText);
    if (!this.showZero) {
      result = result.filter((i) => i.quantity > 0);
    }
    this.items = result;
  }
}
