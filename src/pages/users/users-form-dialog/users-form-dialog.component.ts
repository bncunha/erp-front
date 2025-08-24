import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputMaskModule } from 'primeng/inputmask';
import { UsersFormDialogService } from './users-form-dialog.service';
import { NgForm } from '@angular/forms';
import { GetUserResponse } from '../../../service/responses/users-response';

@Component({
  selector: 'app-users-form-dialog',
  imports: [SharedModule, InputMaskModule],
  templateUrl: './users-form-dialog.component.html',
  styleUrl: './users-form-dialog.component.scss',
  providers: [UsersFormDialogService],
})
export class UsersFormDialogComponent {
  @ViewChild('f') form!: NgForm;
  @Output() onSubmitSuccess = new EventEmitter<void>();
  service = inject(UsersFormDialogService);

  isOpen: boolean = false;
  isLoading = false;

  open(user?: GetUserResponse) {
    this.service.onOpenDialog(this.form, user);
    this.isOpen = true;
  }

  handleSubmit(form: NgForm) {
    this.isLoading = true;
    this.service.submitForm(form).subscribe(
      () => {
        this.isLoading = false;
        this.isOpen = false;
        this.onSubmitSuccess.emit();
      },
      (err) => {
        this.isLoading = false;
        throw err;
      }
    );
  }
}
