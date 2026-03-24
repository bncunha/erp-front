import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { QuoteShippingTypeOptions } from '../../enums/quote-shipping-type.enum';
import { GetCustomerResponse } from '../../service/responses/customers-response';
import { GetSkuResponse } from '../../service/responses/products-response';
import { QuickProductDialogComponent } from '../../shared/components/quick-product-dialog/quick-product-dialog.component';
import { CustomersFormDialogComponent } from '../sales-form/customers-form-dialog/customers-form-dialog.component';
import { QuotesFormService } from './quotes-form.service';

@Component({
  selector: 'app-quotes-form',
  imports: [
    SharedModule,
    CustomersFormDialogComponent,
    QuickProductDialogComponent,
  ],
  providers: [QuotesFormService],
  templateUrl: './quotes-form.component.html',
  styleUrl: './quotes-form.component.scss',
})
export class QuotesFormComponent implements OnInit {
  @ViewChild('customerDialog') customerDialog?: CustomersFormDialogComponent;
  @ViewChild('quickProductDialog')
  quickProductDialog?: QuickProductDialogComponent;

  private service = inject(QuotesFormService);

  ngOnInit(): void {
    this.service.init();
  }

  get id(): number | undefined {
    return this.service.id;
  }

  get isLoading(): boolean {
    return this.service.isLoading;
  }

  get customers(): GetCustomerResponse[] {
    return this.service.customers;
  }

  get skus(): GetSkuResponse[] {
    return this.service.skus;
  }

  get shippingOptions(): typeof QuoteShippingTypeOptions {
    return this.service.shippingOptions;
  }

  get form(): FormGroup {
    return this.service.form;
  }

  get items(): FormArray {
    return this.service.items;
  }

  addItem(): void {
    this.service.addItem();
  }

  removeItem(index: number): void {
    this.service.removeItem(index);
  }

  onShippingTypeChange(): void {
    this.service.onShippingTypeChange();
  }

  onCustomerCreated(): void {
    this.service.onCustomerCreated();
  }

  onQuickProductCreated(): void {
    this.service.onQuickProductCreated();
  }

  saveDraft(): void {
    this.service.saveDraft();
  }

  viewPdf(): void {
    this.service.viewPdf();
  }

  getSubtotal(): number {
    return this.service.getSubtotal();
  }

  getTotal(): number {
    return this.service.getTotal();
  }

  getDiscountPercentage(): number {
    return this.service.getDiscountPercentage();
  }

  getDiscountAmount(): number {
    return this.service.getDiscountAmount();
  }

  getShippingCost(): number {
    return this.service.getShippingCost();
  }

  getDownPayment(): number {
    return this.service.getDownPayment();
  }

  getRemaining(): number {
    return this.service.getRemaining();
  }
}
