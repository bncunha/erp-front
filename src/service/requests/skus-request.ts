export class CreateSkuRequest {
  code!: string;
  color?: string;
  size?: string;
  cost?: number;
  price?: number;

  parseToRequest(formData: any): CreateSkuRequest {
    Object.assign(this, formData);
    return this;
  }
}
