import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCompanyRequest } from '../requests/register-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterApiService {
  private http = inject(HttpClient);

  create(req: CreateCompanyRequest): Observable<void> {
    return this.http.post<void>(`${environment.API_URL}/signup`, req);
  }
}
