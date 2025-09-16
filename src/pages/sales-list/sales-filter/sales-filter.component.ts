import { Component, inject } from '@angular/core';
import { SalesFilterService } from './sales-filter.service';
import { FilterUtils } from '../../../shared/utils/filter.utils';
import { SharedModule } from '../../../shared/shared.module';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-sales-filter',
  imports: [SharedModule, DatePickerModule],
  templateUrl: './sales-filter.component.html',
  styleUrl: './sales-filter.component.scss',
  providers: [SalesFilterService],
})
export class SalesFilterComponent extends FilterUtils {
  service = inject(SalesFilterService);
}
