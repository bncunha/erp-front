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
        data: { breadcrumb: 'Produtos' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../pages/products-list/products-list.component').then(
                (m) => m.ProductsListComponent
              ),
            data: { breadcrumb: '' },
          },
          {
            path: 'form',
            loadComponent: () =>
              import('../pages/products-form/products-form.component').then(
                (m) => m.ProductsFormComponent
              ),
            data: { breadcrumb: 'Formulário' },
          },
        ],
      },
      {
        path: 'estoque',
        data: { breadcrumb: 'Estoque' },
        children: [
          {
            path: '',
            data: { breadcrumb: '' },
            loadComponent: () =>
              import('./../pages/inventory/inventory.component').then(
                (m) => m.InventoryComponent
              ),
          },
        ],
      },
      {
        path: 'revendedores',
        data: { breadcrumb: 'Revendedores' },
        children: [
          {
            path: '',
            data: { breadcrumb: '' },
            loadComponent: () =>
              import('./../pages/users/users.component').then(
                (m) => m.UsersComponent
              ),
          },
        ],
      },
      {
        path: 'vendas',
        data: { breadcrumb: 'Vendas' },
        children: [
          {
            path: '',
            data: { breadcrumb: '' },
            loadComponent: () =>
              import('./../pages/sales-list/sales-list.component').then(
                (m) => m.SalesListComponent
              ),
          },
          {
            path: 'novo',
            data: { breadcrumb: 'Novo' },
            loadComponent: () =>
              import('./../pages/sales-form/sales-form.component').then(
                (m) => m.SalesFormComponent
              ),
          },
        ],
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
