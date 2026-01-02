import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import {
  LegalDocumentType,
  LegalTermStatusResponse,
} from '../../../service/responses/legal-terms-response';
import { LegalTermsService } from '../../../service/legal-terms.service';

@Component({
  selector: 'app-legal-terms-dialog',
  imports: [SharedModule],
  templateUrl: './legal-terms-dialog.component.html',
  styleUrl: './legal-terms-dialog.component.scss',
})
export class LegalTermsDialogComponent {
  service = inject(LegalTermsService);
  private shouldRejectOnHide = false;

  onShow() {
    this.shouldRejectOnHide = true;
  }

  onHide() {
    if (this.shouldRejectOnHide) {
      this.shouldRejectOnHide = false;
      this.service.rejectPendingTerms();
    }
  }

  onAccept() {
    this.shouldRejectOnHide = false;
    this.service.acceptPendingTerms();
  }

  onReject() {
    this.shouldRejectOnHide = false;
    this.service.rejectPendingTerms();
  }

  getDocumentLabel(term: LegalTermStatusResponse): string {
    switch (term.doc_type) {
      case 'TERMS':
        return 'Termos de Uso';
      case 'PRIVACY':
        return 'Politica de Privacidade';
      default:
        return 'Documento Legal';
    }
  }

  getDocumentRoute(type: LegalDocumentType): string {
    switch (type) {
      case 'TERMS':
        return '/termos';
      case 'PRIVACY':
        return '/privacidade';
      default:
        return '/';
    }
  }
}
