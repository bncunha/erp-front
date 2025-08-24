import { TestBed } from '@angular/core/testing';

import { InventoryFormDialogService } from './inventory-form-dialog.service';

describe('InventoryFormDialogService', () => {
  let service: InventoryFormDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryFormDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
