import { Injectable } from '@angular/core';
import { Column } from '../../shared/components/table/models/column';

@Injectable()
export class UsersService {
  getColumns(): Column[] {
    return [
      {
        header: 'Nome',
        field: 'name',
      },
      {
        header: 'Telefone',
        field: 'phone_number',
      },
    ];
  }
}
