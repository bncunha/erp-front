import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTemplateComponent } from './sidebar-template.component';

describe('SidebarTemplateComponent', () => {
  let component: SidebarTemplateComponent;
  let fixture: ComponentFixture<SidebarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
