import { UserRoleEnum } from '../../enums/user-role.enum';
import { cleanNulls } from '../../shared/utils/clean-nulls';

export class CreateUserRequest {
  name!: string;
  username!: string;
  phone_number?: string;
  password!: string;
  role!: UserRoleEnum;

  parseToRequest(formData: any): CreateUserRequest {
    Object.assign(this, formData);
    return cleanNulls(this);
  }
}

export class UpdateUserRequest extends CreateUserRequest {}
