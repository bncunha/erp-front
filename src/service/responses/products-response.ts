export interface GetProductResponse {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  skus: GetSkuResponse[];
}

export class GetSkuResponse {
  id!: number;
  code!: string;
  color!: string;
  size!: string;
  cost!: number;
  price!: number;
  name!: string;
  product_name!: string;
  quantity!: number;
  filterName!: string;

  constructor(data: GetSkuResponse) {
    Object.assign(this, data);
    this.filterName = `${this.product_name} - ${this.name} - ${this.code}`;
  }
}
