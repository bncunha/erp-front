import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../requests/login-request';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../responses/login-response';
import { ChangePasswordRequest, ForgotPasswordRequest } from '../requests/password-request';


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

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(
      environment.API_URL + '/forgot-password',
      request
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(
      environment.API_URL + '/change-password',
      request
    );
  }
}
