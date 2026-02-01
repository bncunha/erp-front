import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { LegalTermsDialogComponent } from '../shared/components/legal-terms-dialog/legal-terms-dialog.component';
import { BillingStatusFooterComponent } from '../shared/components/billing-status-footer/billing-status-footer.component';
import { BillingStatusStore } from '../service/billing-status.store';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    LoaderComponent,
    ToastComponent,
    LegalTermsDialogComponent,
    BillingStatusFooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'erp-front';
  private billingStatusStore = inject(BillingStatusStore);

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.billingStatusStore.loadStatus().subscribe();
    }
  }
}
