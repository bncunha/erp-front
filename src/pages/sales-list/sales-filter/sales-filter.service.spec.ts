import { TestBed } from '@angular/core/testing';

import { SalesFilterService } from './sales-filter.service';

describe('SalesFilterService', () => {
  let service: SalesFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
