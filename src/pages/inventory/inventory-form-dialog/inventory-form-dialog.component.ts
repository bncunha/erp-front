import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-inventory-form-dialog',
  imports: [SharedModule],
  templateUrl: './inventory-form-dialog.component.html',
  styleUrl: './inventory-form-dialog.component.scss',
})
export class InventoryFormDialogComponent {
  isOpen: boolean = false;

  open() {
    this.isOpen = true;
  }
}
