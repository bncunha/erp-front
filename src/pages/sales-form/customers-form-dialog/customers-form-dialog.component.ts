import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputMaskModule } from 'primeng/inputmask';
import { NgForm } from '@angular/forms';
import { CustomersFormDialogService } from './customers-form-dialog.service';

@Component({
  selector: 'app-customers-form-dialog',
  imports: [SharedModule, InputMaskModule],
  templateUrl: './customers-form-dialog.component.html',
  styleUrl: './customers-form-dialog.component.scss',
  providers: [CustomersFormDialogService],
})
export class CustomersFormDialogComponent {
  @ViewChild('f') form!: NgForm;
  @Output() onSubmitSuccess = new EventEmitter<void>();
  service = inject(CustomersFormDialogService);

  isOpen = false;
  isLoading = false;

  open() {
    this.service.onOpenDialog(this.form);
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
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

