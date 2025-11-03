import { inject, Injectable } from '@angular/core';
import { FilterComponent } from '../../../shared/utils/filter.interface';
import { FilterUtils } from '../../../shared/utils/filter.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from '../../../service/api-service/user-api.service';
import { Observable } from 'rxjs';
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
  filters = this.initializeFilters();

  canFilterByReseller(): boolean {
    const role = this.usersApiService.getUserRole();
    return role === UserRoleEnum.ADMIN;
  }

  getPaymentStatuses(): any[] {
    return GetPaymentEnumList();
  }

  getResellers(): Observable<GetUserResponse[]> {
    return this.usersApiService.getAll();
  }

  getCustomers(): Observable<GetCustomerResponse[]> {
    return this.customersApiService.getAll();
  }

  getFilters(): any {
    return this.filters;
  }

  initializeForm(form: NgForm): void {
    Promise.resolve().then(() => this.syncForm(form));
  }

  submitFilters(form: NgForm): void {
    this.setFilters(form.value);
    this.syncForm(form);
  }

  setFilters(filters: any): void {
    const clone = deepClone(filters);
    const formattedFilters = this.formatFilters(clone);
    const filtersCleaned = this.filterUtils.setFilters(formattedFilters);
    this.filters = this.mapFiltersToForm(filtersCleaned);
    this.router.navigate([], { queryParams: filtersCleaned });
  }

  cleanFilters(f: NgForm): void {
    f.reset();
    this.router.navigate([], { queryParams: {} });
    this.filterUtils.clearFilters();
    this.filters = {};
    this.syncForm(f);
  }

  private initializeFilters(): any {
    const storedFilters = this.filterUtils.getFilters() || {};
    const queryFilters = this.filterUtils.getFiltersFromQueryParams(
      this.route.snapshot.queryParamMap
    );
    const mergedFilters = { ...storedFilters, ...queryFilters };

    if (Object.keys(queryFilters).length) {
      this.filterUtils.setFilters(mergedFilters);
    }
    return this.mapFiltersToForm(mergedFilters);
  }

  private formatFilters(filters: any): any {
    filters.min_date = this.formatDateFilter(filters.min_date);
    filters.max_date = this.formatDateFilter(filters.max_date);

    filters.user_id = this.normalizeIdFilter(filters.user_id);
    filters.customer_id = this.normalizeIdFilter(filters.customer_id);

    if (Array.isArray(filters.user_id) && filters.user_id.length === 0) {
      filters.user_id = undefined;
    }
    if (Array.isArray(filters.customer_id) && filters.customer_id.length === 0) {
      filters.customer_id = undefined;
    }

    return filters;
  }

  private formatDateFilter(value: any): string | undefined {
    if (!value) {
      return undefined;
    }

    const date =
      value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return undefined;
    }

    return DateUtils.formatDate(date);
  }

  private normalizeIdFilter(value: any): number[] | undefined {
    if (!value) {
      return undefined;
    }

    const ids = Array.isArray(value) ? value : [value];
    const normalized = ids
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    return normalized.length ? normalized : undefined;
  }

  private mapFiltersToForm(filters: any): any {
    const mapped: any = {};

    if (!filters) {
      return mapped;
    }

    if (filters.min_date) {
      const minDate = this.parseDateFilter(filters.min_date);
      if (minDate) {
        mapped.min_date = minDate;
      }
    }
    if (filters.max_date) {
      const maxDate = this.parseDateFilter(filters.max_date);
      if (maxDate) {
        mapped.max_date = maxDate;
      }
    }

    const userIds = this.normalizeIdFilter(filters.user_id);
    if (userIds) {
      mapped.user_id = userIds;
    }

    const customerIds = this.normalizeIdFilter(filters.customer_id);
    if (customerIds) {
      mapped.customer_id = customerIds;
    }

    if (filters.payment_status) {
      mapped.payment_status = filters.payment_status;
    }

    return mapped;
  }

  private parseDateFilter(value: any): Date | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    const raw = String(value);
    const candidate = new Date(
      raw.includes('T') ? raw : `${raw}T00:00:00`
    );

    return Number.isNaN(candidate.getTime()) ? undefined : candidate;
  }

  private syncForm(form: NgForm): void {
    if (!form) {
      return;
    }

    const filters = this.getFilters();

    if (filters && Object.keys(filters).length) {
      form.form.patchValue(filters);
    }
  }
}
