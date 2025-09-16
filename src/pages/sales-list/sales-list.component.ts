import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SalesListService } from './sales-list.service';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';
import { SalesFilterComponent } from './sales-filter/sales-filter.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';

@Component({
  selector: 'app-sales-list',
  imports: [
    SharedModule,
    SalesSummaryComponent,
    SalesFilterComponent,
    SalesDetailsComponent,
  ],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
  providers: [SalesListService],
})
export class SalesListComponent {
  service = inject(SalesListService);

  columns = this.service.getColumns();
}
