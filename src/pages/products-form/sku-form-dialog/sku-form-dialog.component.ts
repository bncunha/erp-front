import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkuFormDialogService } from './sku-form-dialog.service';
import { NgForm } from '@angular/forms';
import { GetSkuResponse } from '../../../service/responses/products-response';

@Component({
  selector: 'app-sku-form-dialog',
  imports: [SharedModule, InputNumberModule],
  templateUrl: './sku-form-dialog.component.html',
  styleUrl: './sku-form-dialog.component.scss',
  providers: [SkuFormDialogService],
})
export class SkuFormDialogComponent {
  @ViewChild('f') form!: NgForm;
  @Output() onSubmitSuccess = new EventEmitter<void>();
  private service = inject(SkuFormDialogService);

  isOpen: boolean = false;

  open(productId: number, sku?: GetSkuResponse) {
    this.isOpen = true;
    this.service.onOpenDialog(productId, this.form, sku);
  }

  handleSubmit(form: NgForm) {
    this.service
      .submitForm(
        form,
        this.service.getProductId(),
        this.service.getSkuEditing()?.id
      )
      .subscribe(() => {
        this.isOpen = false;
        this.service.setPRoductId(0);
        this.onSubmitSuccess.emit();
      });
  }
}
