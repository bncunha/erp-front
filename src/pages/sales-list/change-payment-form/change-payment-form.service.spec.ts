import { TestBed } from '@angular/core/testing';

import { ChangePaymentFormService } from './change-payment-form.service';

describe('ChangePaymentFormService', () => {
  let service: ChangePaymentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePaymentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
