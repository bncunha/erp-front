import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { PaymentTypeEnum } from '../../../enums/payment-type.enum';

export class SalesPaymentFormFactory {
  buildForm(totalValue: number): FormArray {
    return new FormBuilder().array([], {
      validators: [this.validateInformedPayment(totalValue)],
    });
  }

  addNewPayment(form: FormArray, payment: PaymentTypeEnum): FormGroup {
    const paymentForm = this.buildPaymentForm(payment);
    form.push(paymentForm);
    return paymentForm;
  }

  removePayment(form: FormArray, paymentType: PaymentTypeEnum) {
    form.removeAt(
      form.value.findIndex((item: any) => item.payment_type === paymentType)
    );
  }

  private buildPaymentForm(payment: PaymentTypeEnum): FormGroup {
    const form = new FormBuilder().group({
      payment_type: [payment, [Validators.required]],
      value: [null, [Validators.required, Validators.min(0.01)]],
      installments_quantity: [null, Validators.required],
      first_installment_date: [null, Validators.required],
    });
    if (
      payment === PaymentTypeEnum.CASH ||
      payment == PaymentTypeEnum.DEBIT_CARD ||
      payment == PaymentTypeEnum.PIX
    ) {
      form.get('installments_quantity')?.disable();
      form.get('first_installment_date')?.disable();
    } else if (payment === PaymentTypeEnum.CREDIT_CARD) {
      form.get('first_installment_date')?.disable();
    }
    return form;
  }

  private validateInformedPayment(totalValue: number): ValidatorFn {
    return (array: AbstractControl): ValidationErrors | null => {
      const paymentValue = array.value.reduce((acc: number, item: any) => {
        return acc + item.value;
      }, 0);
      if (paymentValue != totalValue) {
        return { paymentDiffersFromTotalValue: true };
      }
      return null;
    };
  }
}
