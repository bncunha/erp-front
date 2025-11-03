import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { SalesFilterService } from './sales-filter.service';
import { SharedModule } from '../../../shared/shared.module';
import { DatePickerModule } from 'primeng/datepicker';
import { Observable } from 'rxjs';
import { GetUserResponse } from '../../../service/responses/users-response';
import { GetCustomerResponse } from '../../../service/responses/customers-response';

@Component({
  selector: 'app-sales-filter',
  imports: [SharedModule, DatePickerModule],
  templateUrl: './sales-filter.component.html',
  styleUrl: './sales-filter.component.scss',
  providers: [SalesFilterService],
})
export class SalesFilterComponent implements AfterViewInit {
  service = inject(SalesFilterService);

  resellers: Observable<GetUserResponse[]> = this.service.getResellers();
  customers: Observable<GetCustomerResponse[]> = this.service.getCustomers();
  paymentStatuses: any[] = this.service.getPaymentStatuses();

  @ViewChild('f') form?: NgForm;

  ngAfterViewInit(): void {
    if (this.form) {
      this.service.initializeForm(this.form);
    }
  }

  onSubmit(form: NgForm): void {
    this.service.submitFilters(form);
  }

  onClean(form: NgForm): void {
    this.service.cleanFilters(form);
  }
}
