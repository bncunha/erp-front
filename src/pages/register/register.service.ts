import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, Observable, tap } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface CreateCompanyRequest {
  name: string;
  legalName: string;
  cnpj?: string;
  cpf?: string;
  cellphone: string;
  address: CreateCompanyAddress;
  user: CreateCompanyUserRequest;
}

export interface CreateCompanyAddress {
  street: string;
  neighborhood: string;
  number: string;
  city: string;
  uf: string;
  cep: string;
}

export interface CreateCompanyUserRequest {
  name: string;
  username: string;
  phone_number?: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);

  submit(form: NgForm, isPessoaFisica: boolean): Observable<void> {
    if (!form.valid) return EMPTY;

    const { companyData, address, userData } = form.value;

    const req: CreateCompanyRequest = {
      name: companyData.name,
      legalName: isPessoaFisica ? companyData.name : companyData.legalName,
      cnpj: isPessoaFisica ? undefined : companyData.cnpj,
      cpf: isPessoaFisica ? companyData.cpf : undefined,
      cellphone: companyData.cellphone,
      address: {
        cep: address.cep,
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        uf: address.uf,
      },
      user: {
        name: userData.user_name,
        username: userData.username,
        email: userData.email,
        phone_number: userData.user_phone_number,
        password: userData.password,
      },
    };

    return this.http.post<void>('/signup', req).pipe(
      tap(() => {
        this.toast.showSuccess('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      })
    );
  }
}
