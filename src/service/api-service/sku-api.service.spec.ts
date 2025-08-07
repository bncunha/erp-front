import { TestBed } from '@angular/core/testing';

import { SkuApiService } from './sku-api.service';

describe('SkuApiService', () => {
  let service: SkuApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkuApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
