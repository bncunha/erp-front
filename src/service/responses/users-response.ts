import { UserRoleEnum } from '../../enums/user-role.enum';

export interface GetUserResponse {
  id: number;
  username: string;
  name: string;
  phone_number: string;
  role: UserRoleEnum;
}
