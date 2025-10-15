import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-sales-summary',
  imports: [SharedModule],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss',
})
export class SalesSummaryComponent {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() totalItems!: number;
  @Input() totalValue!: number;
  @Input() nextDisabled: boolean = false;
  @Input() textButton!: string;
  @Input() textButtonBack!: string;
  @Input() paymentValue: number = 10;
  @Input() showNeedToPay: boolean = false;
}
