import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InventoryHomeService } from './inventory-home.service';
import { GetInventorySummaryResponse } from '../../../service/responses/inventory-response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-inventory-home',
  imports: [SharedModule, CardComponent],
  templateUrl: './inventory-home.component.html',
  styleUrl: './inventory-home.component.scss',
  providers: [InventoryHomeService],
})
export class InventoryHomeComponent {
  private service = inject(InventoryHomeService);
  private destroyRef = inject(DestroyRef);

  inventorySummary$: Observable<GetInventorySummaryResponse[]> =
    this.service.getSummary();

  skeletonLoaders = Array.from({ length: 6 }).map((_, index) => index);

  searchControl = new FormControl<string>('');

  constructor() {
    this.service
      .getSearchValue()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchControl.setValue(value, { emitEvent: false });
      });

    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.service.updateSearch(value ?? '');
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
