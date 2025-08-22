import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUserResponse } from '../responses/users-response';
import { environment } from '../../environments/environment';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from '../requests/users-request';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private httpCliente = inject(HttpClient);

  getAll(): Observable<GetUserResponse[]> {
    return this.httpCliente.get<GetUserResponse[]>(
      environment.API_URL + '/users'
    );
  }

  getById(id: number): Observable<GetUserResponse> {
    return this.httpCliente.get<GetUserResponse>(
      environment.API_URL + `/users/${id}`
    );
  }

  createUser(user: CreateUserRequest): Observable<void> {
    return this.httpCliente.post<void>(environment.API_URL + '/users', user);
  }

  updateUser(id: number, user: UpdateUserRequest): Observable<void> {
    return this.httpCliente.put<void>(
      environment.API_URL + `/users/${id}`,
      user
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.httpCliente.delete<void>(environment.API_URL + `/users/${id}`);
  }
}
