import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Column } from '../../../../shared/components/table/models/column';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { SkuInventoryDetailsService } from './sku-inventory-details.service';
import { CardComponent } from "../../../../shared/components/card/card.component";

@Component({
  selector: 'app-sku-inventory-details',
  standalone: true,
  imports: [CommonModule, DialogModule, TableComponent, CardComponent],
  templateUrl: './sku-inventory-details.component.html',
  styleUrl: './sku-inventory-details.component.scss',
})
export class SkuInventoryDetailsComponent {
  inventoryService = inject(SkuInventoryDetailsService);

  inventoryColumns: Column[] = [
    { header: 'Estoque', field: 'inventory_name' },
    { header: 'Quantidade', field: 'quantity' },
  ];

  transactionColumns: Column[] = [
    { header: 'Data', field: 'date' },
    { header: 'Tipo', field: 'type' },
    { header: 'Quantidade', field: 'quantity' },
    { header: 'Saiu de', field: 'origin' },
    { header: 'Entrou para', field: 'destination' },
    {
      header: 'Justificativa',
      field: 'justification',
      valueFn: (item) => item.justification || '-',
    },
  ];
}
