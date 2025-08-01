import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { FormControlName, Validators } from '@angular/forms';

@Directive({
  selector: '[formControlName]',
  standalone: true,
})
export class FormGroupRequiredAsteriscDirective implements AfterViewInit {
  constructor(private el: ElementRef, private controlName: FormControlName) {}

  ngAfterViewInit(): void {
    const previousSibling = this.el.nativeElement.previousSibling;
    const isRequired = this.controlName.control.hasValidator(
      Validators.required
    );
    const hasEndAsterisc = previousSibling?.innerText?.match(/^(.*)\*$/g);
    if (
      isRequired &&
      previousSibling?.localName == 'label' &&
      !hasEndAsterisc
    ) {
      previousSibling.innerText += '*';
    }
  }
}
