import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePaymentFormComponent } from './change-payment-form.component';

describe('ChangePaymentFormComponent', () => {
  let component: ChangePaymentFormComponent;
  let fixture: ComponentFixture<ChangePaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePaymentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
