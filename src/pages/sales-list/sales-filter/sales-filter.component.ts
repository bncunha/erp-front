import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SalesFilterService } from './sales-filter.service';
import { FilterUtils } from '../../../shared/utils/filter.utils';
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
export class SalesFilterComponent {
  service = inject(SalesFilterService);

  resellers: Observable<GetUserResponse[]> = this.service.getResellers();
  customers: Observable<GetCustomerResponse[]> = this.service.getCustomers();
  paymentStatuses: any[] = this.service.getPaymentStatuses();
}
