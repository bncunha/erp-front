import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  InventoryFormDialogService,
  InventoryTransactionType,
} from './inventory-form-dialog.service';
import { TextareaModule } from 'primeng/textarea';
import { FormGroup, NgForm } from '@angular/forms';

export interface InventoryFormDialogOptions {
  type?: InventoryTransactionType;
  inventoryId?: number;
}

@Component({
  selector: 'app-inventory-form-dialog',
  imports: [SharedModule, TextareaModule],
  templateUrl: './inventory-form-dialog.component.html',
  styleUrl: './inventory-form-dialog.component.scss',
  providers: [InventoryFormDialogService],
})
export class InventoryFormDialogComponent {
  @Output() onSubmitSuccess = new EventEmitter<void>();
  service = inject(InventoryFormDialogService);

  isOpen: boolean = false;
  isLoading: boolean = false;

  inventories = this.service.getInventoriesSubject();
  allProducts = this.service.getProductsSubject();
  form: FormGroup = this.service.createForm();

  open(options?: InventoryFormDialogOptions) {
    this.isOpen = true;
    setTimeout(() => {
      this.service.fetchInventories();
      this.service.resetForm(this.form);
      if (options?.type) {
        this.service.setTransactionType(options.type, this.form);
      }
      if (options?.inventoryId && options?.type) {
        if (options.type === 'IN') {
          this.form
            .get('inventory_destination_id')
            ?.setValue(options.inventoryId);
        } else {
          this.form
            .get('inventory_origin_id')
            ?.setValue(options.inventoryId);
          this.service.fetchOriginProducts(options.inventoryId);
        }
      }
    });
  }

  handleSubmit(f: FormGroup) {
    this.isLoading = true;
    this.service.handleSubmit(f).subscribe(
      () => {
        this.isOpen = false;
        this.isLoading = false;
        this.onSubmitSuccess.emit();
      },
      (err) => {
        this.isLoading = false;
        throw err;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
