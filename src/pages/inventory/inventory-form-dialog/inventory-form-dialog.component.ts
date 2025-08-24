import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryFormDialogService } from './inventory-form-dialog.service';
import { TextareaModule } from 'primeng/textarea';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inventory-form-dialog',
  imports: [SharedModule, TextareaModule],
  templateUrl: './inventory-form-dialog.component.html',
  styleUrl: './inventory-form-dialog.component.scss',
  providers: [InventoryFormDialogService],
})
export class InventoryFormDialogComponent {
  @Output() onSubmitSuccess = new EventEmitter<void>();
  @ViewChild('f') form!: NgForm;
  service = inject(InventoryFormDialogService);

  isOpen: boolean = false;
  isLoading: boolean = false;

  inventories = this.service.getInventoriesSubject();
  allProducts = this.service.getProductsSubject();

  open() {
    this.isOpen = true;
    setTimeout(() => {
      this.service.fetchInventories();
      this.service.resetForm(this.form);
    });
  }

  handleSubmit(f: NgForm) {
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
      }
    );
  }
}
