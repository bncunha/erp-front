import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { BillingStatusStore } from '../../../service/billing-status.store';

@Component({
  selector: 'app-billing-status-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-status-footer.component.html',
  styleUrl: './billing-status-footer.component.scss',
})
export class BillingStatusFooterComponent {
  private authService = inject(AuthService);
  billingStatusStore = inject(BillingStatusStore);

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
