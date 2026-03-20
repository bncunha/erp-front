import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  QuoteShippingTypeEnum,
  QuoteShippingTypeOptions,
} from '../../enums/quote-shipping-type.enum';
import { QuoteStatusEnum } from '../../enums/quote-status.enum';
import { QuotesApiService } from '../../service/api-service/quotes-api.service';
import { CustomerApiService } from '../../service/api-service/customer-api.service';
import { SkuApiService } from '../../service/api-service/sku-api.service';
import { UpsertQuoteRequest } from '../../service/requests/quotes-request';
import { GetCustomerResponse } from '../../service/responses/customers-response';
import { GetSkuResponse } from '../../service/responses/products-response';
import { ToastService } from '../../shared/components/toast/toast.service';
import { DateUtils } from '../../shared/utils/date.utils';
import { FormUtil } from '../../shared/utils/form.utils';

@Injectable()
export class QuotesFormService {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quotesApi = inject(QuotesApiService);
  private customerApi = inject(CustomerApiService);
  private skuApi = inject(SkuApiService);
  private toast = inject(ToastService);

  id?: number;
  isLoading = false;
  customers: GetCustomerResponse[] = [];
  skus: GetSkuResponse[] = [];
  shippingOptions = QuoteShippingTypeOptions;

  form: FormGroup = this.fb.group({
    customer_id: [null, [Validators.required]],
    valid_until: [this.getDefaultValidUntil(), [Validators.required]],
    down_payment_percentage: [
      50,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
    discount_percentage: [0, [Validators.min(0), Validators.max(100)]],
    shipping_type: [QuoteShippingTypeEnum.FREE, [Validators.required]],
    shipping_cost: [null],
    shipping_region: [null],
    shipping_min_value: [null],
    notes: [null],
    items: this.fb.array([], [Validators.required]),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  init(): void {
    this.loadCustomers();
    this.reloadSkus();
    this.route.params.subscribe((params) => {
      this.id = params['id'] ? Number(params['id']) : undefined;
      if (this.id) {
        this.loadQuote();
      } else if (this.items.length === 0) {
        this.addItem();
      }
    });
  }

  addItem(): void {
    const group = this.createItemGroup();
    this.items.push(group);
    this.updateItemTotal(group);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onShippingTypeChange(): void {
    const shippingType = this.form.get('shipping_type')?.value;
    if (shippingType !== QuoteShippingTypeEnum.FREE_REGION) {
      this.form.get('shipping_region')?.setValue(null);
    }
    if (shippingType !== QuoteShippingTypeEnum.FREE_MIN_VALUE) {
      this.form.get('shipping_min_value')?.setValue(null);
    }
    if (shippingType !== QuoteShippingTypeEnum.TO_CALCULATE) {
      this.form.get('shipping_cost')?.setValue(null);
    }
  }

  onCustomerCreated(): void {
    this.loadCustomers();
  }

  onQuickProductCreated(): void {
    this.reloadSkus();
  }

  saveDraft(): void {
    this.submitQuote();
  }

  viewPdf(): void {
    if (!this.id) {
      return;
    }
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/producao/orcamentos', this.id, 'impressao']),
    );
    window.open(url, '_blank');
  }

  getSubtotal(): number {
    return this.items.controls.reduce(
      (acc, control) => acc + Number(control.get('total_price')?.value || 0),
      0,
    );
  }

  getTotal(): number {
    return (
      this.getSubtotal() - this.getDiscountAmount() + this.getShippingCost()
    );
  }

  getDownPayment(): number {
    return (
      (this.getTotal() *
        Number(this.form.get('down_payment_percentage')?.value || 0)) /
      100
    );
  }

  getRemaining(): number {
    return this.getTotal() - this.getDownPayment();
  }

  getDiscountPercentage(): number {
    return Number(this.form.get('discount_percentage')?.value || 0);
  }

  getDiscountAmount(): number {
    return (this.getSubtotal() * this.getDiscountPercentage()) / 100;
  }

  getShippingCost(): number {
    return Number(this.form.get('shipping_cost')?.value || 0);
  }

  private submitQuote(afterSave?: () => void): void {
    this.applyShippingValidation();
    if (this.form.invalid || this.items.length === 0) {
      this.form.markAllAsTouched();
      FormUtil.markInvalidControlsAsDirty(this.form);
      this.toast.showError('Preencha os campos obrigatórios do orçamento.');
      return;
    }

    this.isLoading = true;
    const payload = new UpsertQuoteRequest().parseToRequest(this.toPayload());
    const request$ = this.id
      ? this.quotesApi.update(this.id, payload)
      : this.quotesApi.create(payload);

    request$.subscribe({
      next: (response) => {
        this.id = response.id;
        this.toast.showSuccess('Orçamento salvo com sucesso!');
        this.isLoading = false;
        this.router.navigate(['/producao/orcamentos']);
      },
      error: (err) => {
        this.isLoading = false;
        throw err;
      },
    });
  }

  private loadQuote(): void {
    if (!this.id) {
      return;
    }
    this.isLoading = true;
    this.quotesApi.getById(this.id).subscribe({
      next: (quote) => {
        this.items.clear();
        quote.items.forEach((item) => {
          const group = this.createItemGroup({
            sku_id: item.sku_id,
            product_description: item.product_description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
          });
          this.items.push(group);
        });

        this.form.patchValue({
          customer_id: quote.customer.id,
          valid_until: quote.valid_until
            ? new Date(`${quote.valid_until}T00:00:00`)
            : this.getDefaultValidUntil(),
          down_payment_percentage: quote.down_payment_percentage,
          discount_percentage: quote.discount_percentage,
          shipping_type: quote.shipping_type,
          shipping_cost: quote.shipping_cost || null,
          shipping_region: quote.shipping_region,
          shipping_min_value: quote.shipping_min_value,
          notes: quote.notes,
        });

        this.onShippingTypeChange();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private createItemGroup(value?: any): FormGroup {
    const group = this.fb.group({
      sku_id: [value?.sku_id || null, [Validators.required]],
      product_description: [value?.product_description || ''],
      quantity: [
        value?.quantity ?? 1,
        [Validators.required, Validators.min(0.01)],
      ],
      unit_price: [
        value?.unit_price ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      total_price: [{ value: value?.total_price ?? 0, disabled: true }],
    });

    group.get('sku_id')?.valueChanges.subscribe((skuID) => {
      const sku = this.skus.find((item) => item.id === Number(skuID));
      if (!sku) {
        return;
      }
      group.patchValue(
        {
          unit_price: sku.price,
          product_description: `${sku.filterName || ''}`,
        },
        { emitEvent: false },
      );
      this.updateItemTotal(group);
    });

    group
      .get('quantity')
      ?.valueChanges.subscribe(() => this.updateItemTotal(group));
    group
      .get('unit_price')
      ?.valueChanges.subscribe(() => this.updateItemTotal(group));

    return group;
  }

  private toPayload(): any {
    return {
      ...this.form.getRawValue(),
      valid_until: DateUtils.formatDate(this.form.get('valid_until')?.value),
      items: this.items.controls.map((control) => ({
        sku_id: control.get('sku_id')?.value,
        quantity: Number(control.get('quantity')?.value),
        unit_price: Number(control.get('unit_price')?.value),
      })),
    };
  }

  private reloadSkus(): void {
    this.skuApi.getAll().subscribe((skus) => {
      this.skus = skus || [];
    });
  }

  private loadCustomers(): void {
    this.customerApi
      .getAll()
      .subscribe((customers) => (this.customers = customers || []));
  }

  private updateItemTotal(group: FormGroup): void {
    const quantity = Number(group.get('quantity')?.value || 0);
    const unitPrice = Number(group.get('unit_price')?.value || 0);
    const total = quantity * unitPrice;
    group.get('total_price')?.setValue(total, { emitEvent: false });
  }

  private applyShippingValidation(): void {
    const shippingType = this.form.get('shipping_type')?.value;
    const shippingCostControl = this.form.get('shipping_cost');
    const regionControl = this.form.get('shipping_region');
    const minValueControl = this.form.get('shipping_min_value');

    shippingCostControl?.clearValidators();
    regionControl?.clearValidators();
    minValueControl?.clearValidators();

    if (shippingType === QuoteShippingTypeEnum.TO_CALCULATE) {
      shippingCostControl?.setValidators([Validators.min(0)]);
    }
    if (shippingType === QuoteShippingTypeEnum.FREE_REGION) {
      regionControl?.setValidators([Validators.required]);
    }
    if (shippingType === QuoteShippingTypeEnum.FREE_MIN_VALUE) {
      minValueControl?.setValidators([
        Validators.required,
        Validators.min(0.01),
      ]);
    }

    shippingCostControl?.updateValueAndValidity({ emitEvent: false });
    regionControl?.updateValueAndValidity({ emitEvent: false });
    minValueControl?.updateValueAndValidity({ emitEvent: false });
  }

  private getDefaultValidUntil(): Date {
    const value = new Date();
    value.setDate(value.getDate() + 10);
    return value;
  }
}
