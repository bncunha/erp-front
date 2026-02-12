export class CreateSalesReturnRequest {
  returner_name!: string;
  reason!: string;
  inventory_destination_id!: number | null;
  items!: CreateSalesReturnItemRequest[];

  parseToRequest(formData: any): CreateSalesReturnRequest {
    this.returner_name = String(formData?.returner_name || '').trim();
    this.reason = String(formData?.reason || '').trim();

    const rawDestinationId = formData?.inventory_destination_id;
    if (!rawDestinationId) {
      this.inventory_destination_id = null;
    } else {
      const destinationId = Number(rawDestinationId);
      this.inventory_destination_id = Number.isNaN(destinationId)
        ? null
        : destinationId;
    }

    this.items = (Array.isArray(formData?.items) ? formData.items : [])
      .map((item: any) =>
        new CreateSalesReturnItemRequest().parseToRequest(item),
      )
      .filter(
        (item: CreateSalesReturnItemRequest) =>
          !!item.sku_id && item.quantity > 0,
      );

    return this;
  }
}

export class CreateSalesReturnItemRequest {
  sku_id!: number;
  quantity!: number;

  parseToRequest(formData: any): CreateSalesReturnItemRequest {
    this.sku_id = Number(formData?.sku_id);
    this.quantity = Number(formData?.quantity);
    return this;
  }
}
