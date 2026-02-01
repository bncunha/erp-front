import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { ToastService } from '../../components/toast/toast.service';

const DEFAULT_READONLY_REASON =
  'Apenas consulta ativado, contate os administradores';

@Directive({
  selector: '[appDisableWhenReadonly]',
  standalone: true,
})
export class DisableWhenReadonlyDirective {
  @Input('appDisableWhenReadonly') canWrite: boolean | null | undefined = true;
  @Input() readonlyReason?: string;

  constructor(private toastService: ToastService) {}

  @HostBinding('class.app-readonly-disabled')
  get isReadonly(): boolean {
    return this.canWrite === false;
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): string | null {
    return this.canWrite === false ? 'true' : null;
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): string | null {
    return this.canWrite === false ? '-1' : null;
  }

  @HostBinding('attr.title')
  get title(): string | null {
    return this.canWrite === false
      ? this.readonlyReason || DEFAULT_READONLY_REASON
      : null;
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event): void {
    if (this.canWrite === false) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.toastService.showWarning(
        this.readonlyReason || DEFAULT_READONLY_REASON,
        'Somente leitura'
      );
    }
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  handleKeydown(event: Event): void {
    if (this.canWrite === false) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.toastService.showWarning(
        this.readonlyReason || DEFAULT_READONLY_REASON,
        'Somente leitura'
      );
    }
  }
}
