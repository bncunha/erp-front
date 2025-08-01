import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriresFormDialogComponent } from './categorires-form-dialog.component';

describe('CategoriresFormDialogComponent', () => {
  let component: CategoriresFormDialogComponent;
  let fixture: ComponentFixture<CategoriresFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriresFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriresFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
