import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  SkuFormDialogService,
  SubmitSkuResponse,
} from './sku-form-dialog.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sku-form-dialog',
  imports: [SharedModule, InputNumberModule],
  templateUrl: './sku-form-dialog.component.html',
  styleUrl: './sku-form-dialog.component.scss',
  providers: [SkuFormDialogService],
})
export class SkuFormDialogComponent {
  @Output() onSubmitSuccess = new EventEmitter<SubmitSkuResponse>();
  @Input() productId?: number;

  private service = inject(SkuFormDialogService);

  isOpen: boolean = false;

  open() {
    this.isOpen = true;
  }

  handleSubmit(form: NgForm) {
    this.service.submitForm(form, this.productId).subscribe((skuRequest) => {
      if (!this.productId) {
        this.onSubmitSuccess.emit(skuRequest);
      }
    });
  }
}
