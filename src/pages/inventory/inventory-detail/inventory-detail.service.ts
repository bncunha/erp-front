import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { GetInventorySummaryResponse } from '../../../service/responses/inventory-response';

@Injectable()
export class InventoryDetailService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryApiService = inject(InventoryApiService);

  private summarySubject = new BehaviorSubject<GetInventorySummaryResponse | null>(
    null
  );
  summary$ = this.summarySubject.asObservable();

  private summaryLoadingSubject = new BehaviorSubject<boolean>(false);
  isSummaryLoading$ = this.summaryLoadingSubject.asObservable();

  resolveInventoryId(): number | null {
    const inventoryIdParam = this.route.snapshot.paramMap.get('inventoryId');
    const parsedId = inventoryIdParam !== null ? Number(inventoryIdParam) : NaN;

    if (!inventoryIdParam || Number.isNaN(parsedId) || parsedId <= 0) {
      this.router.navigate(['/estoque']);
      return null;
    }

    return parsedId;
  }

  loadSummary(inventoryId: number | null): void {
    if (inventoryId === null) {
      this.summarySubject.next(null);
      this.summaryLoadingSubject.next(false);
      return;
    }

    this.summaryLoadingSubject.next(true);
    this.inventoryApiService
      .getInventorySummary(inventoryId)
      .pipe(take(1))
      .subscribe({
        next: (summary) => {
          this.summarySubject.next(summary);
          this.summaryLoadingSubject.next(false);
        },
        error: () => {
          this.summarySubject.next(null);
          this.summaryLoadingSubject.next(false);
        },
      });
  }
}
