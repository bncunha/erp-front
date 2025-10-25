import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  InventoryFormDialogService,
  InventoryFormDialogOptions,
} from './inventory-form-dialog.service';
import { TextareaModule } from 'primeng/textarea';
import { FormGroup } from '@angular/forms';
import { GetInventoryItemsResponse } from '../../../service/responses/inventory-response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  InventoryTypeEnum,
  getInventoryTypeColor,
  getInventoryTypeLabel,
} from '../../../enums/inventory-type.enum';

@Component({
  selector: 'app-inventory-form-dialog',
  imports: [SharedModule, TextareaModule],
  templateUrl: './inventory-form-dialog.component.html',
  styleUrl: './inventory-form-dialog.component.scss',
  providers: [InventoryFormDialogService],
})
export class InventoryFormDialogComponent {
  @Output() onSubmitSuccess = new EventEmitter<void>();
  service = inject(InventoryFormDialogService);
  private destroyRef = inject(DestroyRef);

  protected readonly getInventoryTypeLabel = getInventoryTypeLabel;
  protected readonly getInventoryTypeColor = getInventoryTypeColor;
  protected readonly InventoryTypeEnum = InventoryTypeEnum;

  isOpen: boolean = false;
  isLoading: boolean = false;

  form: FormGroup;

  constructor() {
    this.form = this.service.createForm();

    const quantityControl = this.form.get('quantity');
    const destinationControl = this.form.get('inventory_destination_id');
    if (quantityControl) {
      quantityControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.service.updateProjectedQuantities(this.form));
    }

    if (destinationControl) {
      destinationControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((destinationId) => {
          this.service.handleDestinationChange(destinationId, this.form);
        });
    }
  }

  open(options?: InventoryFormDialogOptions) {
    this.isOpen = true;
    setTimeout(() => {
      this.service.open(this.form, options);
    });
  }

  get transactionType(): InventoryTypeEnum | null {
    return this.service.getTransactionType();
  }

  get selectedProduct(): GetInventoryItemsResponse | null {
    return this.service.getSelectedProduct();
  }

  get currentInventoryProjectedQuantity(): number | null {
    return this.service.getCurrentInventoryProjectedQuantity();
  }

  get destinationCurrentQuantity(): number | null {
    return this.service.getDestinationCurrentQuantity();
  }

  get destinationProjectedQuantity(): number | null {
    return this.service.getDestinationProjectedQuantity();
  }

  get destinationInventories$() {
    return this.service.getDestinationInventories();
  }

  getDestinationInventoryName(): string | null {
    return this.service.getDestinationInventoryName();
  }

  handleSubmit(f: FormGroup) {
    this.isLoading = true;
    this.service.handleSubmit(f).subscribe(
      () => {
        this.isOpen = false;
        this.isLoading = false;
        this.onSubmitSuccess.emit();
      },
      (err) => {
        this.isLoading = false;
        throw err;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
