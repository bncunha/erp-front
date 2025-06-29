import { TestBed } from '@angular/core/testing';

import { SidebarTemplateService } from './sidebar-template.service';

describe('SidebarTemplateService', () => {
  let service: SidebarTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
