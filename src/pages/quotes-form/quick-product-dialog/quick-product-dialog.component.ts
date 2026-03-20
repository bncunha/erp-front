import { Component, EventEmitter, Output, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { QuickProductDialogService } from './quick-product-dialog.service';

@Component({
  selector: 'app-quick-product-dialog',
  imports: [SharedModule],
  providers: [QuickProductDialogService],
  templateUrl: './quick-product-dialog.component.html',
  styleUrl: './quick-product-dialog.component.scss',
})
export class QuickProductDialogComponent {
  @Output() onSubmitSuccess = new EventEmitter<void>();

  private service = inject(QuickProductDialogService);

  get isOpen(): boolean {
    return this.service.isOpen;
  }

  set isOpen(value: boolean) {
    this.service.isOpen = value;
  }

  get isLoading(): boolean {
    return this.service.isLoading;
  }

  get formData(): any {
    return this.service.formData;
  }

  open(): void {
    this.service.open();
  }

  submit(): void {
    this.service.submit(() => this.onSubmitSuccess.emit());
  }
}
