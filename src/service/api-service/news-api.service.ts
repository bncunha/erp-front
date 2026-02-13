import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsLatestResponse } from '../responses/news-response';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private http = inject(HttpClient);

  getLatest(): Observable<NewsLatestResponse> {
    return this.http.get<NewsLatestResponse>(`${environment.API_URL}/news/latest`);
  }
}
