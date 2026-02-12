import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { SalesReturnFormComponent } from './sales-return-form.component';
import { SalesReturnFormService } from './sales-return-form.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { GetSaleResponse } from '../../../service/responses/sales-response';

describe('SalesReturnFormComponent', () => {
  let mockService: jasmine.SpyObj<SalesReturnFormService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let formBuilder: FormBuilder;

  const mockSale = {
    id: 1,
    code: 'V-01',
    date: '2026-02-11',
    total_value: 100,
    seller_name: 'Seller',
    customer_name: 'Customer',
    received_value: 50,
    future_revenue: 50,
    payment_status: 'PENDING',
    payments: [],
    returns: [],
    items: [
      {
        sku_id: 10,
        code: 'SKU-10',
        description: 'Produto',
        quantity: 2,
        unit_price: 50,
        total_value: 100,
      },
    ],
  } as GetSaleResponse;

  beforeEach(async () => {
    formBuilder = new FormBuilder();
    const form = formBuilder.group({
      returner_name: ['Maria'],
      reason: ['Defeito'],
      inventory_destination_id: [null],
      items: formBuilder.array([
        formBuilder.group({
          sku_id: [10],
          quantity: [1],
        }),
      ]),
    });

    mockService = jasmine.createSpyObj<SalesReturnFormService>(
      'SalesReturnFormService',
      [
        'createForm',
        'open',
        'resetForm',
        'hasValidItems',
        'submit',
        'canAddItem',
        'addItemControl',
        'getItemControls',
        'getMaxQuantity',
        'getAvailableItems',
        'onSkuChange',
        'removeItemControl',
      ],
      {
        isLoading: false,
        isAdmin: false,
        inventories$: of([]),
      }
    );
    mockService.createForm.and.returnValue(form);
    mockService.hasValidItems.and.returnValue(true);
    mockService.submit.and.returnValue(of(void 0));
    mockService.canAddItem.and.returnValue(false);
    mockService.getItemControls.and.returnValue((form.get('items') as FormArray).controls as any);
    mockService.getMaxQuantity.and.returnValue(2);
    mockService.getAvailableItems.and.returnValue([]);

    mockToastService = jasmine.createSpyObj<ToastService>('ToastService', [
      'showWarning',
      'confirm',
    ]);
    mockToastService.confirm.and.callFake((accept: () => any) => accept());

    await TestBed.configureTestingModule({
      imports: [SalesReturnFormComponent],
    })
      .overrideComponent(SalesReturnFormComponent, {
        set: {
          providers: [
            { provide: SalesReturnFormService, useValue: mockService },
            { provide: ToastService, useValue: mockToastService },
          ],
        },
      })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SalesReturnFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open and delegate to service', fakeAsync(() => {
    const fixture = TestBed.createComponent(SalesReturnFormComponent);
    const component = fixture.componentInstance;
    component.open(mockSale);
    tick();
    expect(mockService.open).toHaveBeenCalledWith(component.form, mockSale);
  }));

  it('should confirm before submitting', () => {
    const fixture = TestBed.createComponent(SalesReturnFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.submit(component.form);

    expect(mockToastService.confirm).toHaveBeenCalled();
    expect(mockService.submit).toHaveBeenCalled();
  });
});
