import { cleanNulls } from '../../shared/utils/clean-nulls';
import { CreateSkuRequest } from './skus-request';

export class CreatProductRequest {
  name!: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  skus?: CreateSkuRequest[];

  parseToRequest(formData: any): CreatProductRequest {
    Object.assign(this, formData);
    return cleanNulls(this);
  }
}

export class UpdateProductRequest extends CreatProductRequest {}
