// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  breadcrumbs$ = new BehaviorSubject<MenuItem[]>([]);
  home: MenuItem = {
    label: 'Início',
    url: '/',
    target: '_self',
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs = this.buildBreadcrumbs(root);
        this.breadcrumbs$.next(breadcrumbs);
      });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const label = route.data['breadcrumb'];
    const path = route.routeConfig?.path;

    if (path) {
      const lastUrlPart = this.replaceParams(path, route.params);
      url += `/${lastUrlPart}`;
    }

    if (label) {
      breadcrumbs.push({ label, url, target: '_self' });
    }

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private replaceParams(path: string, params: { [key: string]: any }): string {
    return path.replace(/:([^\/]+)/g, (_, key) => params[key] || key);
  }
}
