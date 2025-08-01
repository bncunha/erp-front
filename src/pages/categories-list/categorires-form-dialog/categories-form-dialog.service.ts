import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriesApiService } from '../../../service/api-service/categories-api.service';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../../service/requests/categories-request';
import { GetCategoriesResponse } from '../../../service/responses/categories-response';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { EMPTY, Observable, tap } from 'rxjs';

@Injectable()
export class CategoriesFormDialogService {
  categoryService = inject(CategoriesApiService);
  toastService = inject(ToastService);

  isOpen: boolean = false;
  private itemUpdating?: GetCategoriesResponse;

  submitForm(form: NgForm): Observable<void> {
    if (form.valid) {
      if (this.itemUpdating) {
        return this.updateCategory(
          this.itemUpdating.id,
          new UpdateCategoryRequest().parseToRequest(form.value)
        );
      } else {
        return this.createCategory(
          new CreateCategoryRequest().parseToRequest(form.value)
        );
      }
    }
    return EMPTY;
  }

  private createCategory(request: CreateCategoryRequest) {
    return this.categoryService.createCategory(request).pipe(
      tap((response) => {
        this.toastService.showSuccess('Categoria criada com sucesso');
        this.isOpen = false;
      })
    );
  }

  private updateCategory(id: number, request: UpdateCategoryRequest) {
    return this.categoryService.updateCategory(id, request).pipe(
      tap((response) => {
        this.toastService.showSuccess('Categoria atualizada com sucesso');
        this.isOpen = false;
      })
    );
  }

  updateForm(ngForm: NgForm, item?: GetCategoriesResponse) {
    ngForm.resetForm();
    this.itemUpdating = item;
    if (item) {
      ngForm.form.patchValue(item);
    }
  }
}
