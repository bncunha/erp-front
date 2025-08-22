import { TestBed } from '@angular/core/testing';

import { UsersFormDialogService } from './users-form-dialog.service';

describe('UsersFormDialogService', () => {
  let service: UsersFormDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersFormDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
