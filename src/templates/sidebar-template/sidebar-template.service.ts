import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './models/menu-item';
import { PrimeIcons } from 'primeng/api';

@Injectable()
export class SidebarTemplateService {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  private menuItems: MenuItem[] = [
    {
      icon: PrimeIcons.HOME,
      name: 'Início',
      routerLink: '/',
    },
    {
      icon: PrimeIcons.BOX,
      name: 'Produtos',
      routerLink: '/produtos',
    },
    {
      icon: PrimeIcons.LIST,
      name: 'Categorias',
      routerLink: '/categorias',
    },
    {
      icon: PrimeIcons.WAREHOUSE,
      name: 'Estoque',
      routerLink: '/estoque',
    },
    {
      icon: PrimeIcons.ID_CARD,
      name: 'Usuários',
      routerLink: '/usuarios',
    },
    {
      icon: PrimeIcons.DOLLAR,
      name: 'Vendas',
      routerLink: '/vendas',
    },
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  toggleSidebar(isOpen: boolean): void {
    this.isSidebarOpenSubject.next(isOpen);
  }

  getIsSidebarOpen$(): Observable<boolean> {
    return this.isSidebarOpenSubject.asObservable();
  }
}
