import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginRequest } from '../../service/requests/login-request';
import { AuthApiService } from '../../service/api-service/auth-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authApiService = inject(AuthApiService);
  private router = inject(Router);
  isLoading = false;

  handleSubmit(f: NgForm) {
    if (f.valid) {
      const request = new LoginRequest().parseToRequest(f.value);
      this.isLoading = true;
      this.authApiService
        .login(request)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }

  cleanUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    sessionStorage.clear();
  }
}
