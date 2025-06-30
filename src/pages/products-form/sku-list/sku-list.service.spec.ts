import { TestBed } from '@angular/core/testing';

import { SkuListService } from './sku-list.service';

describe('SkuListService', () => {
  let service: SkuListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkuListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
