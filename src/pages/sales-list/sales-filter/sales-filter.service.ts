import { inject, Injectable } from '@angular/core';
import { FilterComponent } from '../../../shared/utils/filter.interface';
import { FilterUtils } from '../../../shared/utils/filter.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from '../../../service/api-service/user-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetUserResponse } from '../../../service/responses/users-response';
import { UserRoleEnum } from '../../../enums/user-role.enum';
import { CustomerApiService } from '../../../service/api-service/customer-api.service';
import { GetCustomerResponse } from '../../../service/responses/customers-response';
import { NgForm } from '@angular/forms';
import { GetPaymentEnumList } from '../../../enums/payment.enum';
import { deepClone } from '../../../shared/utils/deep-clone.utis';
import { DateUtils } from '../../../shared/utils/date.utils';

@Injectable()
export class SalesFilterService implements FilterComponent {
  private filterUtils = new FilterUtils();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersApiService = inject(UserApiService);
  private customersApiService = inject(CustomerApiService);

  getPaymentStatuses(): any[] {
    return GetPaymentEnumList();
  }

  getResellers(): Observable<GetUserResponse[]> {
    return this.usersApiService.getAll();
  }

  getCustomers(): Observable<GetCustomerResponse[]> {
    return this.customersApiService.getAll();
  }

  getFilters(): any {}

  setFilters(filters: any): void {
    const clone = deepClone(filters);
    clone.min_date = DateUtils.formatDate(clone.min_date);
    clone.max_date = DateUtils.formatDate(clone.max_date);
    const filtersCleaned = this.filterUtils.setFilters(clone);
    this.router.navigate([], { queryParams: filtersCleaned });
  }

  cleanFilters(f: NgForm): void {
    f.reset();
    this.router.navigate([], { queryParams: {} });
    this.filterUtils.clearFilters();
  }
}
