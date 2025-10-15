import { TestBed } from '@angular/core/testing';

import { SalesConfirmationService } from './sales-confirmation.service';

describe('SalesConfirmationService', () => {
  let service: SalesConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
