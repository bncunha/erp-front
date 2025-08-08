import { inject, Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';
import { CategoriesApiService } from '../../service/api-service/categories-api.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { GetCategoriesResponse } from '../../service/responses/categories-response';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable()
export class CategoriesService {
  private reloadSubject = new BehaviorSubject<void>(undefined);

  categoriesServie = inject(CategoriesApiService);
  toastService = inject(ToastService);

  getAll(): Observable<GetCategoriesResponse[]> {
    return this.reloadSubject.pipe(
      switchMap(() => this.categoriesServie.getCategories())
    );
  }

  reload() {
    this.reloadSubject.next();
  }

  delete(item: GetCategoriesResponse) {
    this.toastService.confirm(() => {
      this.categoriesServie.deleteCategory(item.id).subscribe(() => {
        this.reload();
      });
    });
  }

  getColumns(): Column[] {
    return [
      {
        field: 'name',
        header: 'Nome',
      },
    ];
  }
}
