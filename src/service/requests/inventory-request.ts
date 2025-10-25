import { InventoryTypeEnum } from '../../enums/inventory-type.enum';

export class DoIventoryTransationRequest {
  type!: InventoryTypeEnum;
  skus?: DoInventoryTransactionSkusRequest[];
  inventory_origin_id?: number;
  inventory_destination_id?: number;
  justification!: string;

  parseToRequest(formData: any): DoIventoryTransationRequest {
    Object.assign(this, formData);
    this.skus = [{
      sku_id: formData.sku_id,
      quantity: formData.quantity
    }];
    return this;
  }
}

class DoInventoryTransactionSkusRequest {
  sku_id!: number;
  quantity!: number;
}
