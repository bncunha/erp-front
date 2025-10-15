import { inject, Injectable } from '@angular/core';
import { PaymentTypeEnum } from '../../../enums/payment-type.enum';
import { SalesPaymentFormFactory } from './form.facotry';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SalesPaymentFormService {
  private router = inject(Router);
  private formFactory = new SalesPaymentFormFactory();

  private productsFormValue: any;

  // Dialog control
  confirmationVisible$ = new BehaviorSubject<boolean>(false);

  today: Date = new Date();
  nextMonth: Date = this.getNextMonth();

  initStep(): boolean {
    const onError = () => {
      this.toBackStep();
      return false;
    };
    if (this.canAccessStep()) {
      try {
        this.productsFormValue = JSON.parse(
          sessionStorage.getItem('sales_products_form') || ''
        );
        return true;
      } catch (e) {
        return onError();
      }
    } else {
      return onError();
    }
  }

  canAccessStep() {
    return !!sessionStorage.getItem('sales_products_form');
  }

  buildForm(): FormArray {
    return this.formFactory.buildForm(this.calculateTotalValue());
  }

  isPaymentChecked(form: FormArray, payment: PaymentTypeEnum) {
    return form.value.find((item: any) => item.payment_type === payment);
  }

  togglePayment(form: FormArray, payment: PaymentTypeEnum, event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.formFactory.addNewPayment(form, payment);
    } else {
      this.formFactory.removePayment(form, payment);
    }
  }

  onValueChange(group: FormGroup) {
    group.get('installments_quantity')?.patchValue(null);
  }

  getInstallmentsQuantity(totalValue: number) {
    if (!totalValue) {
      return [];
    }
    const maxInstallment = totalValue < 50 ? 1 : 6;
    const options = [];
    for (let i = 1; i <= maxInstallment; i++) {
      options.push({
        label: `${i}x de R$ ${(totalValue / i).toFixed(2)}`,
        value: i,
      });
    }
    return options;
  }
  calculatePayment(form: FormArray) {
    const values: any[] = form.value;
    return values?.reduce((prev, cur) => prev + cur.value, 0);
  }

  calculateTotalValue() {
    return this.productsFormValue.products.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price;
    }, 0);
  }

  getTotalItems() {
    return this.productsFormValue.products.reduce((acc: number, item: any) => {
      return acc + item.quantity;
    }, 0);
  }

  toBackStep() {
    this.router.navigate(['/vendas/novo']);
  }

  // Popup de confirmação
  toNextStep(form?: FormArray) {
    // apenas abre o popup; os dados são lidos pelos inputs do componente
    this.confirmationVisible$.next(true);
  }

  closeConfirmation() {
    this.confirmationVisible$.next(false);
  }

  getProducts() {
    return this.productsFormValue?.products || [];
  }

  getCustomerId(): number {
    return this.productsFormValue?.customer;
  }

  private getNextMonth(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }
}
