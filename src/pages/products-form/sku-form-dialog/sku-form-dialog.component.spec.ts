import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuFormDialogComponent } from './sku-form-dialog.component';

describe('SkuFormDialogComponent', () => {
  let component: SkuFormDialogComponent;
  let fixture: ComponentFixture<SkuFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkuFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
