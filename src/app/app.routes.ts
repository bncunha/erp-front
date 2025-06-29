import { Routes } from '@angular/router';
import { SidebarTemplateComponent } from '../templates/sidebar-template/sidebar-template.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: SidebarTemplateComponent,
    pathMatch: 'full',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
];
