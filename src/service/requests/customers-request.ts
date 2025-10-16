import { cleanNulls } from '../../shared/utils/clean-nulls';

export class CreateCustomerRequest {
  name!: string;
  cellphone!: string;

  parseToRequest(formData: any): CreateCustomerRequest {
    Object.assign(this, formData);
    return cleanNulls(this);
  }
}
