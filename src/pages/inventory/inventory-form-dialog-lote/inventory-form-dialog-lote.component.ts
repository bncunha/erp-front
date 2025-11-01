import { Component, EventEmitter, Output, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TextareaModule } from 'primeng/textarea';
import { FormGroup } from '@angular/forms';
import {
  InventoryFormDialogLoteOptions,
  InventoryFormDialogLoteService,
} from './inventory-form-dialog-lote.service';
import {
  InventoryTypeEnum,
  getInventoryTypeColor,
  getInventoryTypeLabel,
} from '../../../enums/inventory-type.enum';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-inventory-form-dialog-lote',
  imports: [SharedModule, TextareaModule],
  templateUrl: './inventory-form-dialog-lote.component.html',
  styleUrl: './inventory-form-dialog-lote.component.scss',
  providers: [InventoryFormDialogLoteService],
})
export class InventoryFormDialogLoteComponent {
  @Output() onSubmitSuccess = new EventEmitter<void>();

  service = inject(InventoryFormDialogLoteService);
  private confirmationService = inject(ConfirmationService);

  protected readonly getInventoryTypeLabel = getInventoryTypeLabel;
  protected readonly getInventoryTypeColor = getInventoryTypeColor;
  protected readonly InventoryTypeEnum = InventoryTypeEnum;

  isOpen = false;
  isLoading = false;
  inventoryName = '-';

  form: FormGroup;

  constructor() {
    this.form = this.service.createForm();
  }

  open(options: InventoryFormDialogLoteOptions) {
    this.isOpen = true;
    this.inventoryName = options.inventoryName;
    setTimeout(() => {
      this.service.open(this.form, options);
    });
  }

  get skuControls() {
    return this.service.getSkuControls(this.form);
  }

  get destinationInventories$() {
    return this.service.getDestinationInventories();
  }

  get transactionType(): InventoryTypeEnum {
    return this.service.getTransactionType();
  }

  get isTransfer(): boolean {
    return this.transactionType === InventoryTypeEnum.TRANSFER;
  }

  getDestinationCurrentQuantity(skuId: number): number {
    return this.service.getDestinationCurrentQuantity(skuId);
  }

  getDestinationProjectedQuantity(control: FormGroup): number | null {
    return this.service.getDestinationProjectedQuantity(control);
  }

  getOriginProjectedQuantity(control: FormGroup): number {
    return this.service.getOriginProjectedQuantity(control);
  }

  removeProduct(index: number) {
    this.service.removeProductControl(this.form, index);
  }

  onDestinationChange(destinationId: number | null) {
    this.service.handleDestinationChange(destinationId, this.form);
  }

  setAllQuantitiesToOne() {
    this.confirmationService.confirm({
      header: 'Aplicar quantidade mínima',
      message: 'Isso definirá todos os produtos para 1 unidade. Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.applyBulkQuantity('one'),
    });
  }

  setAllQuantitiesToMax() {
    this.confirmationService.confirm({
      header: 'Definir quantidade máxima para todos',
      message:
        'Todos os produtos serão configurados com a quantidade máxima disponível. Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.applyBulkQuantity('max'),
    });
  }

  private applyBulkQuantity(mode: 'one' | 'max') {
    this.skuControls.forEach((control) => {
      const available = Number(control.get('available_quantity')?.value ?? 0);

      if (available <= 0 && this.transactionType !== InventoryTypeEnum.IN) {
        return;
      }

      let targetQuantity: number;

      if (mode === 'one') {
        targetQuantity = 1;
      } else if (this.transactionType === InventoryTypeEnum.IN) {
        targetQuantity = Math.max(available, 1);
      } else {
        targetQuantity = available;
      }
      const quantityControl = control.get('quantity');

      quantityControl?.setValue(targetQuantity);
      quantityControl?.markAsDirty();
      quantityControl?.markAsTouched();
      quantityControl?.updateValueAndValidity();
    });

    this.form.markAsDirty();
  }

  handleSubmit(form: FormGroup) {
    if (form.invalid || this.skuControls.length < 1) {
      form.markAllAsTouched();
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar movimentação',
      message: 'Esta ação é irreversível. Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.submitForm(form),
    });
  }

  private submitForm(form: FormGroup) {
    this.isLoading = true;
    this.service.handleSubmit(form).subscribe({
      next: () => {
        this.isOpen = false;
        this.isLoading = false;
        this.onSubmitSuccess.emit();
      },
      error: (err) => {
        this.isLoading = false;
        throw err;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
