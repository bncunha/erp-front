import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'form label',
  standalone: true,
})
export class RequiredAsteriscDirective implements AfterViewInit, OnChanges {
  @Input() requiredUpdateText?: string; 
  private _viewInitialized = false;


  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.updateText();
    this._viewInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requiredUpdateText'] && this._viewInitialized) {
      this.updateText(true);
    }
  }

  private updateText(forceUpdate?: boolean): void {
    const nextSibling = this.el.nativeElement.nextSibling;
    const hasEndAsterisc = this.el.nativeElement?.innerText?.match(/^(.*)\*$/g);
    const isRequired = nextSibling?.hasAttribute?.('required');
    if (isRequired && (!hasEndAsterisc || forceUpdate)) {
      const text = this.requiredUpdateText || this.el.nativeElement.innerText;
      this.el.nativeElement.innerText = text + '*';
    }
  }
}
