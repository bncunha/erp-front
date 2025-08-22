import { inject, Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { UserApiService } from '../../service/api-service/user-api.service';
import { GetUserResponse } from '../../service/responses/users-response';
import { GetUserRoleEnumList } from '../../enums/user-role.enum';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable()
export class UsersService {
  private reloadSubject = new BehaviorSubject<void>(undefined);

  private userApiService = inject(UserApiService);
  private toastService = inject(ToastService);

  getAll(): Observable<GetUserResponse[]> {
    return this.reloadSubject.pipe(
      switchMap(() => this.userApiService.getAll())
    );
  }

  reload() {
    this.reloadSubject.next();
  }

  getColumns(): Column[] {
    return [
      {
        header: 'Nome',
        field: 'name',
      },
      {
        header: 'Usuário',
        field: 'username',
      },
      {
        header: 'Telefone',
        field: 'phone_number',
      },
      {
        header: 'Função',
        field: 'role',
        valueFn: (item) => {
          return (
            GetUserRoleEnumList().find((r) => r.value === item.role)?.label ||
            '-'
          );
        },
      },
    ];
  }

  delete(item: GetUserResponse) {
    this.toastService.confirm(() => {
      this.userApiService.deleteUser(item.id).subscribe(() => {
        this.reloadSubject.next();
      });
    });
  }
}
