import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export type DocumentType = 'termos' | 'privacidade';

interface LastVersionResponse {
  version: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentsApiService {
  private http = inject(HttpClient);
  private readonly basePath = 'documents';

  getLastVersion(type: DocumentType): Observable<string> {
    return this.http
      .get<LastVersionResponse>(`${this.basePath}/${type}/last_version.json`)
      .pipe(map((res) => res.version));
  }

  getDocument(type: DocumentType, version: string): Observable<string> {
    return this.http.get(`${this.basePath}/${type}/${version}.md`, {
      responseType: 'text',
    });
  }
}
