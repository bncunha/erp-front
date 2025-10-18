import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginRequest } from '../../service/requests/login-request';
import { AuthApiService } from '../../service/api-service/auth-api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authApiService = inject(AuthApiService);
  private router = inject(Router);

  handleSubmit(f: NgForm) {
    if (f.valid) {
      const request = new LoginRequest().parseToRequest(f.value);
      this.authApiService.login(request).subscribe(() => {
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
