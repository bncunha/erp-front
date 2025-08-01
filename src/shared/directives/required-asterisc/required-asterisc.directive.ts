import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'form label',
  standalone: true,
})
export class RequiredAsteriscDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const nextSibling = this.el.nativeElement.nextSibling;
    const hasEndAsterisc = this.el.nativeElement?.innerText?.match(/^(.*)\*$/g);
    const isRequired = nextSibling?.hasAttribute?.('required');
    if (isRequired && !hasEndAsterisc) {
      this.el.nativeElement.innerText += '*';
    }
  }
}
