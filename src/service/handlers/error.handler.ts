import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToastService);

  handleError(err: any): void {
    this.toastService.showError(err?.error?.message || 'Erro inesperado!');
    console.error(err);
  }
}
