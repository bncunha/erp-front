import { TestBed } from '@angular/core/testing';

import { SalesFormService } from '../sales-form.service';

describe('SalesFormService', () => {
  let service: SalesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
