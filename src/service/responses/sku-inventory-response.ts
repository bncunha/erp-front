export interface GetSkuInventoryResponse {
  inventory_name: string;
  quantity: number;
}

export interface GetSkuTransactionResponse {
  date: string;
  type: string;
  quantity: number;
  origin: string;
  destination: string;
  justification?: string;
}
