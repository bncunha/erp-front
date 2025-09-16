import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBadgeComponent } from './payment-badge.component';

describe('PaymentBadgeComponent', () => {
  let component: PaymentBadgeComponent;
  let fixture: ComponentFixture<PaymentBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
