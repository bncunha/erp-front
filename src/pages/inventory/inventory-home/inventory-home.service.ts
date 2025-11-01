import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { GetInventorySummaryResponse } from '../../../service/responses/inventory-response';
import { FilterUtils } from '../../../shared/utils/filter.utils';
import { applySearchFilter } from '../../../shared/utils/search.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class InventoryHomeService {
  private inventoryApiService = inject(InventoryApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private filterUtils = new FilterUtils();

  private searchSubject = new BehaviorSubject<string>('');

  private summaries$ = this.inventoryApiService
    .getSummary()
    .pipe(shareReplay(1));

  private initialSyncDone = false;

  constructor() {
    const savedFilters = this.filterUtils.getFilters();
    const savedSearch = (savedFilters?.search as string) ?? '';
    if (savedSearch) {
      this.searchSubject.next(savedSearch);
    }

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (!this.initialSyncDone) {
          this.initialSyncDone = true;
          if (!Object.keys(params).length && savedSearch) {
            this.router.navigate([], {
              queryParams: { search: savedSearch },
              replaceUrl: true,
            });
            return;
          }
        }

        const search = (params['search'] as string) ?? '';
        this.filterUtils.setFilters({ search });
        this.searchSubject.next(search);
      });
  }

  getSummary(): Observable<GetInventorySummaryResponse[]> {
    return combineLatest([this.summaries$, this.searchSubject]).pipe(
      map(([summaries, search]) =>
        applySearchFilter(summaries, search ?? '')
      )
    );
  }

  updateSearch(search: string): void {
    const filters = this.filterUtils.setFilters({ search });
    this.router.navigate([], { queryParams: filters });
  }

  getSearchValue(): Observable<string> {
    return this.searchSubject.asObservable();
  }

}
