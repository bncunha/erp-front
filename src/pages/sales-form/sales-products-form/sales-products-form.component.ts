import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DatePickerModule } from 'primeng/datepicker';
import { ItemsListComponent } from '../items-list/items-list.component';
import { SalesFormService } from '../sales-form.service';
import { tap } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-products-form.component',
  imports: [SharedModule, DatePickerModule, ItemsListComponent],
  templateUrl: './sales-products-form.component.html',
  styleUrl: './sales-products-form.component.scss',
  providers: [SalesFormService],
})
export class SalesProductsFormComponent {
  service = inject(SalesFormService);

  customers = this.service.getCustomers();
  skus = this.service.getSkus();
  form: FormGroup = this.service.buildForm();

  getProductsForm(): FormArray {
    return this.form.get('products') as FormArray;
  }
}
