import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './model/menu-item';
import { PrimeIcons } from 'primeng/api';

@Injectable()
export class SidebarTemplateService {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  private menuItems: MenuItem[] = [
    {
      icon: PrimeIcons.HOME,
      name: 'Início',
      routerLink: '/inicio',
    },
    {
      icon: PrimeIcons.HOME,
      name: 'Início',
      routerLink: '/inicio',
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
