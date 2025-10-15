import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

export class FormUtil {
  fb = new UntypedFormBuilder();

  static updateFormArray(formArray: UntypedFormArray, itens: any[], fc: any) {
    const isDisabled = formArray.disabled;
    this.zerarFormArray(formArray);
    if (itens) {
      itens.forEach((item) => formArray.push(fc(item)));
    }
    if (isDisabled) {
      formArray.disable();
    }
  }

  static removerFormArray(formArray: UntypedFormArray, index: number) {
    formArray.removeAt(index);
  }

  static zerarFormArray(formArray: UntypedFormArray) {
    while (formArray && formArray.length != 0) {
      formArray.removeAt(0);
    }
  }

  static validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        if (control.invalid) {
          console.log(field, control.errors);
        }
        control.markAsTouched({ onlySelf: true });
      } else if (
        control instanceof UntypedFormGroup ||
        control instanceof UntypedFormArray
      ) {
        this.validateAllFormFields(control);
      }
    });
  }

  static addControlError(control: AbstractControl, error: any) {
    control.setErrors({ ...control.errors, ...error });
  }

  static removeControlError(control: any, errorName: string) {
    if (control.errors) {
      Object.keys(control.errors).forEach((erro) => {
        if (erro === errorName && control.errors) {
          delete control.errors[erro];
          if (Object.keys(control.errors).length === 0) {
            control.setErrors(null);
          }
        }
      });
    }
  }
}
