import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DashboardWidgetDataResponse,
  DashboardWidgetItem,
} from '../responses/dashboard-response';
import { DashboardWidgetDataRequest } from '../requests/dashboard-request';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private http = inject(HttpClient);

  getWidgets(): Observable<DashboardWidgetItem[]> {
    return this.http.get<DashboardWidgetItem[]>(
      environment.API_URL + '/dashboard/widgets'
    );
  }

  getWidgetData(
    payload: DashboardWidgetDataRequest
  ): Observable<DashboardWidgetDataResponse> {
    return this.http.post<DashboardWidgetDataResponse>(
      environment.API_URL + '/dashboard/widgets/data',
      payload
    );
  }
}
