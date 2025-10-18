import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DatePickerModule } from 'primeng/datepicker';
import { ItemsListComponent } from '../items-list/items-list.component';
import { FormArray, FormGroup } from '@angular/forms';
import { SalesSummaryComponent } from '../sales-summary/sales-summary.component';
import { CustomersFormDialogComponent } from '../customers-form-dialog/customers-form-dialog.component';
import { SalesProductsFormService } from './sales-products-form.service';
import { defer, finalize } from 'rxjs';

@Component({
  selector: 'app-sales-products-form.component',
  imports: [
    SharedModule,
    DatePickerModule,
    ItemsListComponent,
    SalesSummaryComponent,
    CustomersFormDialogComponent,
  ],
  templateUrl: './sales-products-form.component.html',
  styleUrl: './sales-products-form.component.scss',
  providers: [SalesProductsFormService],
})
export class SalesProductsFormComponent {
  service = inject(SalesProductsFormService);

  isLoading: boolean = false;
  customers = this.service.getCustomers();
  skus = defer(() => {
    this.isLoading = true;
    return this.service
      .getSkus()
      .pipe(finalize(() => (this.isLoading = false)));
  });
  form: FormGroup = this.service.buildForm();

  getProductsForm(): FormArray {
    return this.form.get('products') as FormArray;
  }
}
