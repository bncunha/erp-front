import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GetCategoriesResponse } from '../responses/categories-response';
import { Observable } from 'rxjs';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../requests/categories-request';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  http: HttpClient = inject(HttpClient);

  getCategories(): Observable<GetCategoriesResponse[]> {
    return this.http.get<GetCategoriesResponse[]>(
      environment.API_URL + '/categories'
    );
  }

  createCategory(category: CreateCategoryRequest): Observable<void> {
    return this.http.post<void>(environment.API_URL + '/categories', category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(environment.API_URL + `/categories/${id}`);
  }

  updateCategory(
    id: number,
    category: UpdateCategoryRequest
  ): Observable<void> {
    return this.http.put<void>(
      environment.API_URL + `/categories/${id}`,
      category
    );
  }
}
