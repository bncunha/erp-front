import { CommonModule } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  Optional,
} from '@angular/core';
import { NgControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName], [ngModel]', // funciona para os dois
  standalone: true,
})
export class ValidatorMessageDirective implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];

  constructor(
    private el: ElementRef,
    private control: NgControl,
    @Optional() private formGroup: FormGroupDirective, // Reactive Forms
    @Optional() private form: NgForm,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const sub1 = this.control.valueChanges?.subscribe(() => this.updateError());
    if (sub1) this.subscription.push(sub1);

    // se for reactive form
    if (this.formGroup) {
      const sub2 = this.formGroup.ngSubmit.subscribe((event: SubmitEvent) => {
        this.updateError();
      });
      this.subscription.push(sub2);
    } else if (this.form) {
      const sub3 = this.form.ngSubmit.subscribe(() => {
        this.updateError();
      });
      this.subscription.push(sub3);
    }
  }

  private updateError() {
    const parent = this.el.nativeElement.parentElement;

    const existing = parent.querySelector('.auto-error-message');
    if (existing) this.renderer.removeChild(parent, existing);

    if (this.control.invalid && this.shouldShowError()) {
      const msg = this.getMessage(this.control.errors);
      const errorEl = this.renderer.createElement('small');
      this.renderer.addClass(errorEl, 'auto-error-message');
      this.renderer.setStyle(errorEl, 'color', 'red');
      const text = this.renderer.createText(msg);
      this.renderer.appendChild(errorEl, text);
      this.renderer.appendChild(parent, errorEl);
    }
  }

  private shouldShowError(): boolean {
    // Reactive forms: mostra se foi tocado ou se o form foi submetido
    if (this.formGroup) {
      return (
        !!this.control.invalid &&
        (this.control.touched || this.formGroup.submitted)
      );
    }
    if (this.form) {
      return !!this.control.invalid && this.form.submitted;
    }
    return false;
  }

  private getMessage(errors: any): string {
    if (!errors) return '';
    if (errors.required) return 'Campo obrigatório';
    if (errors.minlength)
      return `Mínimo ${errors.minlength.requiredLength} caracteres`;
    if (errors.email) return 'E-mail inválido';
    return 'Campo inválido';
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
