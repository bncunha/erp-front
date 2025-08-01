import { CommonModule } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormsModule, NgControl, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[ngModel]',
  standalone: true,
})
export class ValidatorMessageDirective implements OnInit, OnDestroy {
  isInsideFormGroup: boolean = false;
  subscription: (Subscription | undefined)[] = [];

  constructor(
    private el: ElementRef,
    private control: NgControl,
    private form: NgForm,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isInsideFormGroup = this.el.nativeElement.closest('form');
    if (this.isInsideFormGroup) {
      const sub1 = this.form.ngSubmit.subscribe(() => this.updateError());
      const sub2 = this.control.valueChanges?.subscribe(() =>
        this.updateError()
      );
      this.subscription.push(sub1, sub2);
    }
  }

  private updateError() {
    const parent = this.el.nativeElement.parentElement;

    const existing = parent.querySelector('.auto-error-message');
    if (existing) this.renderer.removeChild(parent, existing);

    if (this.control.invalid && this.form.submitted) {
      const msg = this.getMessage(this.control.errors);
      const errorEl = this.renderer.createElement('small');
      this.renderer.addClass(errorEl, 'auto-error-message');
      this.renderer.setStyle(errorEl, 'color', 'red');
      const text = this.renderer.createText(msg);
      this.renderer.appendChild(errorEl, text);
      this.renderer.appendChild(parent, errorEl);
    }
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
    this.subscription.forEach((sub) => sub?.unsubscribe());
  }
}
