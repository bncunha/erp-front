import { inject, Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { SkuApiService } from '../../../../service/api-service/sku-api.service';
import { GetSkuResponse } from '../../../../service/responses/products-response';
import {
  GetSkuInventoryResponse,
  GetSkuTransactionResponse,
} from '../../../../service/responses/sku-inventory-response';

@Injectable()
export class SkuInventoryDetailsService {
  private skuApiService = inject(SkuApiService);

  isInventoryDialogOpen = false;
  sku: GetSkuResponse | undefined;
  inventories: GetSkuInventoryResponse[] = [];
  transactions: GetSkuTransactionResponse[] = [];
  isInventoryLoading = false;
  isTransactionsLoading = false;

  openInventoryDialog(sku: GetSkuResponse) {
    this.isInventoryDialogOpen = true;
    this.sku = sku;
    this.inventories = [];
    this.transactions = [];
    this.loadInventory(sku.id);
    this.loadTransactions(sku.id);
  }

  closeInventoryDialog() {
    this.isInventoryDialogOpen = false;
    this.inventories = [];
    this.transactions = [];
  }

  private loadInventory(skuId: number) {
    this.isInventoryLoading = true;
    this.skuApiService
      .getInventoryById(skuId)
      .pipe(finalize(() => (this.isInventoryLoading = false)))
      .subscribe({
        next: (inventories) => (this.inventories = inventories),
        error: () => (this.inventories = []),
      });
  }

  private loadTransactions(skuId: number) {
    this.isTransactionsLoading = true;
    this.skuApiService
      .getTransactionsById(skuId)
      .pipe(finalize(() => (this.isTransactionsLoading = false)))
      .subscribe({
        next: (transactions) => (this.transactions = transactions),
        error: () => (this.transactions = []),
      });
  }
}
