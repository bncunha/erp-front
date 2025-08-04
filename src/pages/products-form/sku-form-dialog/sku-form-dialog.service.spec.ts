import { TestBed } from '@angular/core/testing';

import { SkuFormDialogService } from './sku-form-dialog.service';

describe('SkuFormDialogService', () => {
  let service: SkuFormDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkuFormDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
