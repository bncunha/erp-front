import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { LegalTermsDialogComponent } from '../shared/components/legal-terms-dialog/legal-terms-dialog.component';
import { BillingStatusFooterComponent } from '../shared/components/billing-status-footer/billing-status-footer.component';
import { BillingStatusStore } from '../service/billing-status.store';
import { NewsDialogComponent } from '../shared/components/news-dialog/news-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    LoaderComponent,
    ToastComponent,
    LegalTermsDialogComponent,
    NewsDialogComponent,
    BillingStatusFooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'erp-front';
  private billingStatusStore = inject(BillingStatusStore);
  private router = inject(Router);
  hideFooter = false;

  ngOnInit(): void {
    this.updateFooterVisibility(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateFooterVisibility((event as NavigationEnd).urlAfterRedirects);
      });

    if (localStorage.getItem('token')) {
      this.billingStatusStore.loadStatus().subscribe();
    }
  }

  private updateFooterVisibility(url: string): void {
    this.hideFooter = /^\/producao\/orcamentos\/\d+\/impressao(?:\?|$)/.test(url);
  }
}
