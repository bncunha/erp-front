export interface GetInventoryResponse {
  id: number;
  type: string;
}

export interface GetInventoryItemsResponse {
  inventory_item_id: number;
  sku_id: number;
  sku_code: string;
  product_name: string;
  inventory_type: string;
  user_name: string;
  quantity: number;
}

export interface GetTransactionHistoryResponse {
  id: number;
  date: string;
  type: string;
  quantity: number;
  sku_code: string;
  product_name: string;
  origin: string;
  destination: string;
}
