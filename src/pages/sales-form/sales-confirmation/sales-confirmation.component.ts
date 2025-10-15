import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerApiService } from '../../../service/api-service/customer-api.service';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { GetCustomerResponse } from '../../../service/responses/customers-response';
import { GetSkuResponse } from '../../../service/responses/products-response';
import {
  GetPaymentTypeNmae,
  PaymentTypeEnum,
} from '../../../enums/payment-type.enum';
import {
  ConfirmationProductItem,
  SalesConfirmationService,
} from './sales-confirmation.service';

interface PaymentItem {
  payment_type: PaymentTypeEnum;
  value: number;
  installments_quantity?: number | null;
  first_installment_date?: Date | string | null;
}

@Component({
  selector: 'app-sales-confirmation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sales-confirmation.component.html',
  styleUrl: './sales-confirmation.component.scss',
  providers: [SalesConfirmationService],
})
export class SalesConfirmationComponent implements OnChanges {
  service = inject(SalesConfirmationService);

  @Input() visible = false;
  @Input() customerId!: number;
  @Input() products: ConfirmationProductItem[] = [];
  @Input() total = 0;
  @Input() payments: PaymentItem[] = [];
  @Input() isLoading: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.service.loadData(this.customerId, this.products);
    }
  }

  getPaymentLabel(type: PaymentTypeEnum) {
    return GetPaymentTypeNmae(type);
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
