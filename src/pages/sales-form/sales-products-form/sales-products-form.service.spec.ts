import { TestBed } from '@angular/core/testing';

import { SalesProductsFormService } from './sales-products-form.service';

describe('SalesProductsFormService', () => {
  let service: SalesProductsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesProductsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
