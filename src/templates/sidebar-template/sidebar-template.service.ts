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
