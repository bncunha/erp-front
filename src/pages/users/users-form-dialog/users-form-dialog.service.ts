import { inject, Injectable } from '@angular/core';
import { GetUserRoleEnumList } from '../../../enums/user-role.enum';
import { NgForm } from '@angular/forms';
import { GetUserResponse } from '../../../service/responses/users-response';
import { EMPTY, Observable, tap } from 'rxjs';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from '../../../service/requests/users-request';
import { UserApiService } from '../../../service/api-service/user-api.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Injectable()
export class UsersFormDialogService {
  private userApiService = inject(UserApiService);
  private toastService = inject(ToastService);

  private editingUser?: GetUserResponse;

  isPasswordRequired() {
    return !this.editingUser;
  }

  getRoles() {
    return GetUserRoleEnumList();
  }

  onOpenDialog(form: NgForm, user?: GetUserResponse) {
    form.resetForm();
    this.editingUser = undefined;
    if (user) {
      this.editingUser = user;
      form.form.patchValue(user);
    }
  }

  submitForm(form: NgForm): Observable<void> {
    if (form.valid) {
      if (this.editingUser) {
        return this.updateUser(form);
      } else {
        return this.createUser(form);
      }
    }
    return EMPTY;
  }

  private createUser(form: NgForm) {
    const request = new CreateUserRequest().parseToRequest(form.value);
    return this.userApiService.createUser(request).pipe(
      tap((_) => {
        this.toastService.showSuccess('Usuário criado com sucesso!');
      })
    );
  }

  private updateUser(form: NgForm) {
    const request = new UpdateUserRequest().parseToRequest(form.value);
    return this.userApiService.updateUser(this.editingUser!.id, request).pipe(
      tap((_) => {
        this.toastService.showSuccess('Usuário editado com sucesso!');
      })
    );
  }
}
