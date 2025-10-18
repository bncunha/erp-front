import { TestBed } from '@angular/core/testing';

import { SalesPaymentFormService } from './sales-payment-form.service';

describe('SalesPaymentFormService', () => {
  let service: SalesPaymentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPaymentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
