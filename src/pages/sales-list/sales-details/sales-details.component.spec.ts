import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDetailsComponent } from './sales-details.component';
import { of } from 'rxjs';
import { SalesDetailsService } from './sales-details.service';

describe('SalesDetailsComponent', () => {
  let component: SalesDetailsComponent;
  let fixture: ComponentFixture<SalesDetailsComponent>;
  let service: SalesDetailsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesDetailsComponent);
    component = fixture.componentInstance;
    service = fixture.componentRef.injector.get(SalesDetailsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh sale when return succeeds', () => {
    component.sale = {
      id: 55,
      code: 'V-55',
      date: '',
      total_value: 0,
      seller_name: '',
      customer_name: '',
      received_value: 0,
      future_revenue: 0,
      payment_status: '',
      payments: [],
      items: [],
      returns: [],
    };
    spyOn(service, 'getSale').and.returnValue(of(component.sale));

    component.onReturnSuccess();

    expect(service.getSale).toHaveBeenCalledWith(55);
  });
});
