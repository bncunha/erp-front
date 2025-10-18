import { CanActivateFn } from '@angular/router';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data['roles'] as UserRoleEnum[];
  if (!roles?.length) {
    return true;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  const userRole = (jwtDecode(token) as any).role;
  if (roles.includes(userRole)) {
    return true;
  }
  return false;
};
