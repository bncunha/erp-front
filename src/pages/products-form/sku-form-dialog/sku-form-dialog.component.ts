import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-sku-form-dialog',
  imports: [SharedModule, InputNumberModule],
  templateUrl: './sku-form-dialog.component.html',
  styleUrl: './sku-form-dialog.component.scss',
})
export class SkuFormDialogComponent {
  isOpen: boolean = false;

  open() {
    this.isOpen = true;
  }
}
