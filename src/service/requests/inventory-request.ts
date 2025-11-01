import { InventoryTypeEnum } from '../../enums/inventory-type.enum';

export class DoIventoryTransationRequest {
  type!: InventoryTypeEnum;
  skus?: DoInventoryTransactionSkusRequest[];
  inventory_origin_id?: number;
  inventory_destination_id?: number;
  justification!: string;

  parseToRequest(formData: any): DoIventoryTransationRequest {
    Object.assign(this, formData);
    if (Array.isArray(formData.skus) && formData.skus.length > 0) {
      this.skus = formData.skus
        .map((item: any) => ({
          sku_id: Number(item?.sku_id),
          quantity: Number(item?.quantity),
        }))
        .filter(
          (item: DoInventoryTransactionSkusRequest) =>
            !!item.sku_id &&
            !Number.isNaN(item.sku_id) &&
            !!item.quantity &&
            !Number.isNaN(item.quantity)
        );
    } else if (formData.sku_id !== undefined) {
      this.skus = [
        {
          sku_id: Number(formData.sku_id),
          quantity: Number(formData.quantity),
        },
      ];
    } else {
      this.skus = [];
    }
    delete (this as any).sku_id;
    delete (this as any).quantity;
    return this;
  }
}

class DoInventoryTransactionSkusRequest {
  sku_id!: number;
  quantity!: number;
}
