import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../requests/login-request';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../responses/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http: HttpClient = inject(HttpClient);

  login(login: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(environment.API_URL + '/login', login)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.name);
        })
      );
  }
}
