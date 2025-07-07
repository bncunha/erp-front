import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-items-form-dialog',
  imports: [SharedModule, InputNumberModule],
  templateUrl: './items-form-dialog.component.html',
  styleUrl: './items-form-dialog.component.scss',
})
export class ItemsFormDialogComponent {
  isOpen: boolean = false;

  open() {
    this.isOpen = true;
  }
}
