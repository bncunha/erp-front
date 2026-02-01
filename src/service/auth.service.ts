import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoleEnum } from '../enums/user-role.enum';
import { jwtDecode } from 'jwt-decode';
import { BillingStatusStore } from './billing-status.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private billingStatusStore = inject(BillingStatusStore);

  hasRole(role: UserRoleEnum): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const userRole = (jwtDecode(token) as any).role;
    return userRole === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRoleEnum.ADMIN);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    sessionStorage.clear();
    this.billingStatusStore.reset();
    this.router.navigate(['/login']);
  }
}
