import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SalesApiService } from './sales-api.service';
import { environment } from '../../environments/environment';
import { CreateSalesReturnRequest } from '../requests/sales-return-request';

describe('SalesApiService', () => {
  let service: SalesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SalesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create sale return', () => {
    const request = new CreateSalesReturnRequest().parseToRequest({
      returner_name: 'Maria',
      reason: 'Defeito',
      inventory_destination_id: 1,
      items: [{ sku_id: 10, quantity: 2 }],
    });

    service.createReturn(25, request).subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/sales/25/returns`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      returner_name: 'Maria',
      reason: 'Defeito',
      inventory_destination_id: 1,
      items: [{ sku_id: 10, quantity: 2 }],
    });

    req.flush({});
  });
});
