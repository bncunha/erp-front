import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';

export interface ViaCepResponse {
  bairro?: string;
  localidade?: string;
  logradouro?: string;
  uf?: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ViaCepApiService {
  private http = inject(HttpClient);

  fetchAddress(cep: string): Observable<ViaCepResponse | null> {
    if (!cep) return of(null);

    return this.http
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(catchError(() => of(null)));
  }
}
