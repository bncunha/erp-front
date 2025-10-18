import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentFormComponent } from './sales-payment-form.component';

describe('SalesPaymentFormComponent', () => {
  let component: SalesPaymentFormComponent;
  let fixture: ComponentFixture<SalesPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPaymentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
