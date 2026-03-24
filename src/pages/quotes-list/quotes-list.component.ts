import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TableComponent } from '../../shared/components/table/table.component';
import { Column } from '../../shared/components/table/models/column';
import { GetCustomerResponse } from '../../service/responses/customers-response';
import {
  QuoteListItemResponse,
  QuoteStatus,
} from '../../service/responses/quotes-response';
import {
  getQuoteStatusActionLabel,
  getQuoteStatusClass,
  getQuoteStatusLabel,
  QuoteStatusEnum,
} from '../../enums/quote-status.enum';
import { QuotesListService } from './quotes-list.service';

@Component({
  selector: 'app-quotes-list',
  imports: [SharedModule, TableComponent],
  providers: [DatePipe, CurrencyPipe, QuotesListService],
  templateUrl: './quotes-list.component.html',
  styleUrl: './quotes-list.component.scss',
})
export class QuotesListComponent implements OnInit {
  private service = inject(QuotesListService);

  ngOnInit(): void {
    this.service.init();
  }

  get loading(): boolean {
    return this.service.loading;
  }

  get rows(): number {
    return this.service.rows;
  }

  get totalRecords(): number {
    return this.service.totalRecords;
  }

  get items(): QuoteListItemResponse[] {
    return this.service.items;
  }

  get customers(): GetCustomerResponse[] {
    return this.service.customers;
  }

  get filters(): any {
    return this.service.filters;
  }

  get statusOptions(): { label: string; value: QuoteStatusEnum }[] {
    return this.service.statusOptions;
  }

  get columns(): Column[] {
    return this.service.columns;
  }

  get selectedItem(): QuoteListItemResponse | undefined {
    return this.service.selectedItem;
  }

  getQuoteStatusLabel = getQuoteStatusLabel;
  getQuoteStatusActionLabel = getQuoteStatusActionLabel;
  getQuoteStatusClass = getQuoteStatusClass;

  onFilter(): void {
    this.service.onFilter();
  }

  cleanFilters(): void {
    this.service.cleanFilters();
  }

  onLazyLoad(event: any): void {
    this.service.onLazyLoad(event);
  }

  goToNew(): void {
    this.service.goToNew();
  }

  edit(item: QuoteListItemResponse): void {
    this.service.edit(item);
  }

  openPdf(item: QuoteListItemResponse): void {
    this.service.openPdf(item);
  }

  duplicate(item: QuoteListItemResponse): void {
    this.service.duplicate(item);
  }

  getAllowedStatuses(item: QuoteListItemResponse): QuoteStatus[] {
    return this.service.getAllowedStatuses(item);
  }

  changeStatus(item: QuoteListItemResponse, status: QuoteStatus): void {
    this.service.changeStatus(item, status);
  }

  canEdit(item: QuoteListItemResponse): boolean {
    return this.service.canEdit(item);
  }

  onSelectionChange(item?: QuoteListItemResponse): void {
    this.service.setSelectedItem(item);
  }
}
