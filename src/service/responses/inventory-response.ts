export interface GetInventoryResponse {
  id: number;
  type: string;
}

export interface GetInventorySummaryResponse {
  inventory_id: number;
  user_name: string;
  inventory_type: string;
  total_skus: number;
  total_quantity: number;
  stock_value: number;
  zero_quantity_items: number;
  last_transaction_days?: number;
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
