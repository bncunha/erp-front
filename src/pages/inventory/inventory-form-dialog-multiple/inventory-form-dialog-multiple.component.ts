import { Component, EventEmitter, Output, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  InventoryFormDialogMultipleOptions,
  InventoryFormDialogMultipleService,
} from './inventory-form-dialog-multiple.service';
import { TextareaModule } from 'primeng/textarea';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory-form-dialog-multiple',
  imports: [SharedModule, TextareaModule],
  templateUrl: './inventory-form-dialog-multiple.component.html',
  styleUrl: './inventory-form-dialog-multiple.component.scss',
  providers: [InventoryFormDialogMultipleService],
})
export class InventoryFormDialogMultipleComponent {
  @Output() onSubmitSuccess = new EventEmitter<void>();

  service = inject(InventoryFormDialogMultipleService);

  isOpen = false;
  isLoading = false;
  inventoryName = '-';

  form: FormGroup;

  constructor() {
    this.form = this.service.createForm();
  }

  open(options: InventoryFormDialogMultipleOptions) {
    this.isOpen = true;
    this.inventoryName = options.inventoryName;

    setTimeout(() => {
      this.service.open(this.form, options);
    });
  }

  get skuControls(): FormGroup[] {
    return this.service.getSkuControls(this.form);
  }

  addProduct() {
    this.service.addProductControl(this.form);
  }

  removeProduct(index: number) {
    this.service.removeProductControl(this.form, index);
  }

  handleSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.service.handleSubmit(form).subscribe({
      next: () => {
        this.isLoading = false;
        this.isOpen = false;
        this.onSubmitSuccess.emit();
      },
      error: (err) => {
        this.isLoading = false;
        throw err;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
