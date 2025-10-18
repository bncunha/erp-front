export interface GetProductResponse {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  skus: GetSkuResponse[];
}

export interface GetSkuResponse {
  id: number;
  code: string;
  color: string;
  size: string;
  cost: number;
  price: number;
  name: string;
  product_name: string;
  quantity: number;
}
