import { UserRoleEnum } from '../../../enums/user-role.enum';

export interface MenuItem {
  routerLink: string;
  name: string;
  icon: string;
  roles: UserRoleEnum[];
}
