import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
