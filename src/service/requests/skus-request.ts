import { cleanNulls } from '../../shared/utils/clean-nulls';

export class CreateSkuRequest {
  code!: string;
  color?: string;
  size?: string;
  cost?: number;
  price?: number;

  parseToRequest(formData: any): CreateSkuRequest {
    Object.assign(this, formData);
    return cleanNulls(this);
  }
}

export class UpdateSkuRequest extends CreateSkuRequest {}
