import { Injectable, inject } from '@angular/core';
import { Subject, finalize, take } from 'rxjs';
import { UserApiService } from './api-service/user-api.service';
import { LegalTermStatusResponse } from './responses/legal-terms-response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LegalTermsService {
  private userApiService = inject(UserApiService);
  private authService = inject(AuthService);
  private acceptedSubject = new Subject<void>();

  readonly accepted$ = this.acceptedSubject.asObservable();

  pendingTerms: LegalTermStatusResponse[] = [];
  isDialogVisible = false;
  isLoading = false;

  checkPendingTerms() {
    if (this.isLoading || !localStorage.getItem('token')) {
      return;
    }

    this.isLoading = true;
    this.userApiService
      .getLegalTermsStatus()
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (terms) => {
          const pending = terms.filter((term) => !term.accepted);
          this.pendingTerms = pending;
          this.isDialogVisible = pending.length > 0;
        },
        error: () => {
          this.pendingTerms = [];
          this.isDialogVisible = false;
        },
      });
  }

  acceptPendingTerms() {
    if (this.pendingTerms.length === 0 || this.isLoading) {
      return;
    }

    const payload = this.pendingTerms.map((term) => ({
      ...term,
      accepted: true,
    }));

    this.isLoading = true;
    this.userApiService
      .acceptLegalTerms(payload)
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: () => {
          this.pendingTerms = [];
          this.isDialogVisible = false;
          this.acceptedSubject.next();
        },
      });
  }

  rejectPendingTerms() {
    this.pendingTerms = [];
    this.isDialogVisible = false;
    this.authService.logout();
  }
}
