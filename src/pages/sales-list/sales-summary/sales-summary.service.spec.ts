import { TestBed } from '@angular/core/testing';

import { SalesSummaryService } from './sales-summary.service';

describe('SalesSummaryService', () => {
  let service: SalesSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
