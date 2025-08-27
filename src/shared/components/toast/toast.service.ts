import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  showSuccess(message: string, title: string = 'Sucesso') {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  showError(message: string, title: string = 'Erro') {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 10000000,
    });
  }

  confirm(
    accept: () => any,
    message: string = 'Deseja realmente realizar esta operação?',
    title: string = 'Confirmação'
  ) {
    this.confirmService.confirm({
      message: message,
      header: title,
      icon: 'pi pi-exclamation-triangle',
      accept: accept,
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-secondary',
    });
  }
}
