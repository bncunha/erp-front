import { inject, Injectable } from '@angular/core';
import { CustomerApiService } from '../../../service/api-service/customer-api.service';
import { GetCustomerResponse } from '../../../service/responses/customers-response';
import { SkuApiService } from '../../../service/api-service/sku-api.service';
import { GetSkuResponse } from '../../../service/responses/products-response';

export interface ConfirmationProductItem {
  id: number;
  quantity: number;
  price: number;
}

@Injectable()
export class SalesConfirmationService {
  private customerApi = inject(CustomerApiService);
  private skuApi = inject(SkuApiService);

  customerName = '';
  displayItems: Array<{
    name: string;
    quantity: number;
    unit: number;
    lineTotal: number;
    color?: string;
    size?: string;
    code?: string;
  }> = [];

  customerLoading = false;
  itemsLoading = false;

  loadData(customerId: number, products: ConfirmationProductItem[]) {
    this.customerLoading = true;
    this.customerApi.getAll().subscribe({
      next: (customers: GetCustomerResponse[]) => {
        const customer = customers.find((c) => c.id === customerId);
        this.customerName = customer ? customer.name : String(customerId);
      },
      error: () => {
        this.customerName = String(customerId);
      },
      complete: () => (this.customerLoading = false),
    });

    this.itemsLoading = true;
    this.skuApi.getAll().subscribe({
      next: (skus: GetSkuResponse[]) => {
        const byId = new Map<number, GetSkuResponse>(
          skus.map((s) => [s.id, s])
        );
        this.displayItems = (products || []).map((p: any) => {
          const sku = byId.get(p.id);
          const name = sku?.product_name || sku?.name || `SKU #${p.id}`;
          const unit = p.price;
          const lineTotal = p.quantity * p.price;
          return {
            name,
            quantity: p.quantity,
            unit,
            lineTotal,
            color: sku?.color,
            size: sku?.size,
            code: sku?.code,
          };
        });
      },
      error: () => {
        this.displayItems = (products || []).map((p: any) => ({
          name: `SKU #${p.id}`,
          quantity: p.quantity,
          unit: p.price,
          lineTotal: p.quantity * p.price,
        }));
      },
      complete: () => (this.itemsLoading = false),
    });
  }
}
