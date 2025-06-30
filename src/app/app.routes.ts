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
    children: [
      {
        path: 'produtos',
        loadComponent: () =>
          import('../pages/products-list/products-list.component').then(
            (m) => m.ProductsListComponent
          ),
      },
      {
        path: 'produtos/form',
        loadComponent: () =>
          import('../pages/products-form/products-form.component').then(
            (m) => m.ProductsFormComponent
          ),
      },
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
