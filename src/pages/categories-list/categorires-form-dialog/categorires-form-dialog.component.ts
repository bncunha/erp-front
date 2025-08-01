import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CategoriesFormDialogService } from './categories-form-dialog.service';
import { GetCategoriesResponse } from '../../../service/responses/categories-response';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categorires-form-dialog',
  imports: [SharedModule],
  templateUrl: './categorires-form-dialog.component.html',
  styleUrl: './categorires-form-dialog.component.scss',
  providers: [CategoriesFormDialogService],
})
export class CategoriresFormDialogComponent {
  @ViewChild('form') ngForm!: NgForm;
  @Output() onSubmitSuccess = new EventEmitter<void>();

  service = inject(CategoriesFormDialogService);

  open(item?: GetCategoriesResponse) {
    this.service.updateForm(this.ngForm, item);
    this.service.isOpen = true;
  }

  handleSubmit(form: NgForm) {
    this.service.submitForm(form).subscribe(() => this.onSubmitSuccess.emit());
  }
}
