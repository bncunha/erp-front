import {
  Component,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SalesListService } from './sales-list.service';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';
import { SalesFilterComponent } from './sales-filter/sales-filter.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { Observable, Subscription } from 'rxjs';
import { GetAllSalesResponse } from '../../service/responses/sales-response';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  providers: [SalesListService, DatePipe, CurrencyPipe],
})
export class SalesListComponent implements OnInit, OnDestroy {
  service = inject(SalesListService);
  route = inject(ActivatedRoute);

  columns = this.service.getColumns();
  response?: GetAllSalesResponse;
  sub!: Subscription;
  params: any;
  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.getItems(params);
    });
  }

  getItems(params: any) {
    this.service.getAll(params).subscribe((response) => {
      this.response = response;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
