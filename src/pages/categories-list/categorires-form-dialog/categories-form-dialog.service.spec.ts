import { TestBed } from '@angular/core/testing';

import { CategoriesFormDialogService } from './categories-form-dialog.service';

describe('CategoriesFormDialogService', () => {
  let service: CategoriesFormDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesFormDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
