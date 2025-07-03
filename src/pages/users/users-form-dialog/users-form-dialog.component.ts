import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-users-form-dialog',
  imports: [SharedModule, InputMaskModule],
  templateUrl: './users-form-dialog.component.html',
  styleUrl: './users-form-dialog.component.scss',
})
export class UsersFormDialogComponent {
  isOpen: boolean = false;

  open() {
    this.isOpen = true;
  }
}
