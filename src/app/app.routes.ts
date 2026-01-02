import { Routes } from '@angular/router';
import { SidebarTemplateComponent } from '../templates/sidebar-template/sidebar-template.component';
import { authGuard } from '../service/guards/auth.guard';
import { UserRoleEnum } from '../enums/user-role.enum';
import { roleGuard } from '../service/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('../pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'redefinir-senha',
    loadComponent: () =>
      import('../pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('../pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'termos',
    loadComponent: () =>
      import('../pages/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: 'privacidade',
    loadComponent: () =>
      import('../pages/privacy/privacy.component').then(
        (m) => m.PrivacyComponent
      ),
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
            data: { breadcrumb: '', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
          },
          {
            path: 'form',
            loadComponent: () =>
              import('../pages/products-form/products-form.component').then(
                (m) => m.ProductsFormComponent
              ),
            data: { breadcrumb: 'Formulário', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
          },
          {
            path: 'form/:id',
            loadComponent: () =>
              import('../pages/products-form/products-form.component').then(
                (m) => m.ProductsFormComponent
              ),
            data: { breadcrumb: 'Formulário', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
          },
        ],
      },
      {
        path: 'clientes',
        data: { breadcrumb: 'Clientes' },
        children: [
          {
            path: '',
            data: { breadcrumb: '', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
            loadComponent: () =>
              import('../pages/customers-list/customers-list.component').then(
                (m) => m.CustomersListComponent
              ),
          },
          {
            path: 'form',
            data: { breadcrumb: 'Formulário', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
            loadComponent: () =>
              import('../pages/customers-form/customers-form.component').then(
                (m) => m.CustomersFormComponent
              ),
          },
          {
            path: 'form/:id',
            data: { breadcrumb: 'Formulário', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
            loadComponent: () =>
              import('../pages/customers-form/customers-form.component').then(
                (m) => m.CustomersFormComponent
              ),
          },
        ],
      },
      {
        path: 'categorias',
        data: { breadcrumb: 'Categorias' },
        children: [
          {
            path: '',
            data: { breadcrumb: '', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
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
            data: { breadcrumb: '', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
            loadComponent: () =>
              import('../pages/inventory/inventory-home/inventory-home.component').then(
                (m) => m.InventoryHomeComponent
              ),
          },
          {
            path: ':inventoryId',
            data: { breadcrumb: 'Detalhes', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
            loadComponent: () =>
              import(
                './../pages/inventory/inventory-detail/inventory-detail.component'
              ).then((m) => m.InventoryDetailComponent),
          },
        ],
      },
      {
        path: 'usuarios',
        data: { breadcrumb: 'Usuários' },
        children: [
          {
            path: '',
            data: { breadcrumb: '', roles: [UserRoleEnum.ADMIN] },
            canActivate: [roleGuard],
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
            data: {
              beadcrumb: '',
              roles: [UserRoleEnum.ADMIN, UserRoleEnum.RESELLER],
            },
            canActivate: [roleGuard],
            loadComponent: () =>
              import('./../pages/sales-list/sales-list.component').then(
                (m) => m.SalesListComponent
              ),
          },
          {
            path: 'novo',
            data: {
              breadcrumb: 'Nova venda',
              roles: [UserRoleEnum.ADMIN, UserRoleEnum.RESELLER],
            },
            canActivate: [roleGuard],
            loadComponent: () =>
              import(
                './../pages/sales-form/sales-products-form/sales-products-form.component'
              ).then((m) => m.SalesProductsFormComponent),
          },
          {
            path: 'novo/pagamento',
            data: {
              breadcrumb: 'Nova venda',
              roles: [UserRoleEnum.ADMIN, UserRoleEnum.RESELLER],
            },
            canActivate: [roleGuard],
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
