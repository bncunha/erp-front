import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginRequest } from '../../service/requests/login-request';
import { AuthApiService } from '../../service/api-service/auth-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LegalTermsService } from '../../service/legal-terms.service';
import { BillingStatusStore } from '../../service/billing-status.store';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authApiService = inject(AuthApiService);
  private router = inject(Router);
  private legalTermsService = inject(LegalTermsService);
  private billingStatusStore = inject(BillingStatusStore);
  isLoading = false;

  handleSubmit(f: NgForm) {
    if (f.valid) {
      const request = new LoginRequest().parseToRequest(f.value);
      this.isLoading = true;
      this.authApiService
        .login(request)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.legalTermsService.checkPendingTerms();
          this.billingStatusStore.loadStatus().subscribe();
          this.router.navigate(['/']);
        });
    }
  }
}
