import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCompanyRequest } from '../requests/register-request';

@Injectable({
  providedIn: 'root',
})
export class RegisterApiService {
  private http = inject(HttpClient);

  create(req: CreateCompanyRequest): Observable<void> {
    return this.http.post<void>('/signup', req);
  }
}
