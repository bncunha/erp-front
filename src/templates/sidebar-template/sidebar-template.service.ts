import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './models/menu-item';
import { PrimeIcons } from 'primeng/api';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { UserApiService } from '../../service/api-service/user-api.service';

@Injectable()
export class SidebarTemplateService {
  private userApiService = inject(UserApiService);
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  private menuItems: MenuItem[] = [
    {
      icon: PrimeIcons.HOME,
      name: 'Início',
      routerLink: '/',
      roles: [UserRoleEnum.ADMIN, UserRoleEnum.RESELLER],
    },
    {
      icon: PrimeIcons.BOX,
      name: 'Produtos',
      routerLink: '/produtos',
      roles: [UserRoleEnum.ADMIN],
    },
    {
      icon: PrimeIcons.LIST,
      name: 'Categorias',
      routerLink: '/categorias',
      roles: [UserRoleEnum.ADMIN],
    },
    {
      icon: PrimeIcons.WAREHOUSE,
      name: 'Estoque',
      routerLink: '/estoque',
      roles: [UserRoleEnum.ADMIN],
    },
    {
      icon: PrimeIcons.ID_CARD,
      name: 'Usuários',
      routerLink: '/usuarios',
      roles: [UserRoleEnum.ADMIN],
    },
    {
      icon: PrimeIcons.DOLLAR,
      name: 'Vendas',
      routerLink: '/vendas',
      roles: [UserRoleEnum.ADMIN, UserRoleEnum.RESELLER],
    },
    {
      icon: PrimeIcons.USER,
      name: 'Clientes',
      routerLink: '/clientes',
      roles: [UserRoleEnum.ADMIN],
    },
  ];

  getMenuItems(): MenuItem[] {
    const userRole = this.userApiService.getUserRole();
    return this.menuItems.filter((item) => item.roles.includes(userRole));
  }

  toggleSidebar(isOpen: boolean): void {
    this.isSidebarOpenSubject.next(isOpen);
  }

  getIsSidebarOpen$(): Observable<boolean> {
    return this.isSidebarOpenSubject.asObservable();
  }
}
