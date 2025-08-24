import { InventoryTypeEnum } from '../../enums/inventory-type.enum';

export class DoIventoryTransationRequest {
  type!: InventoryTypeEnum;
  sku_id!: number;
  inventory_origin_id?: number;
  inventory_destination_id?: number;
  quantity!: number;
  justification!: string;

  parseToRequest(formData: any): DoIventoryTransationRequest {
    Object.assign(this, formData);
    return this;
  }
}
