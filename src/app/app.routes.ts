import { Routes } from '@angular/router';
import { SidebarTemplateComponent } from '../templates/sidebar-template/sidebar-template.component';
import { authGuard } from '../service/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: SidebarTemplateComponent,
    canActivateChild: [authGuard],
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
          {
            path: 'form/:id',
            loadComponent: () =>
              import('../pages/products-form/products-form.component').then(
                (m) => m.ProductsFormComponent
              ),
            data: { breadcrumb: 'Formulário' },
          },
        ],
      },
      {
        path: 'categorias',
        data: { breadcrumb: 'Categorias' },
        children: [
          {
            path: '',
            data: { breadcrumb: '' },
            loadComponent: () =>
              import(
                './../pages/categories-list/categories-list.component'
              ).then((m) => m.CategoriesListComponent),
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
        path: 'usuarios',
        data: { breadcrumb: 'Usuários' },
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
            data: { breadcrumb: '' },
            loadComponent: () =>
              import(
                './../pages/sales-form/sales-products-form/sales-products-form.component'
              ).then((m) => m.SalesProductsFormComponent),
          },
          {
            path: 'novo/pagamento',
            data: { breadcrumb: '' },
            loadComponent: () =>
              import(
                './../pages/sales-form/sales-payment-form/sales-payment-form.component'
              ).then((m) => m.SalesPaymentFormComponent),
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
