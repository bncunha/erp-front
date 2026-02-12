import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { SalesReturnFormService } from './sales-return-form.service';
import { SalesApiService } from '../../../service/api-service/sales-api.service';
import { InventoryApiService } from '../../../service/api-service/inventory-api.service';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { GetSaleResponse } from '../../../service/responses/sales-response';

describe('SalesReturnFormService', () => {
  let service: SalesReturnFormService;
  let salesApiService: jasmine.SpyObj<SalesApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let form: FormGroup;

  const mockSale = {
    id: 88,
    code: 'V-001',
    date: '2026-02-11',
    total_value: 100,
    seller_name: 'Vendedor',
    customer_name: 'Cliente',
    received_value: 60,
    future_revenue: 40,
    payment_status: 'PENDING',
    payments: [],
    returns: [],
    items: [
      {
        sku_id: 11,
        code: 'SKU-11',
        description: 'Camisa Azul',
        quantity: 2,
        unit_price: 25,
        total_value: 50,
      },
      {
        sku_id: 12,
        code: 'SKU-12',
        description: 'Calça Preta',
        quantity: 1,
        unit_price: 50,
        total_value: 50,
      },
    ],
  } as GetSaleResponse;

  beforeEach(() => {
    salesApiService = jasmine.createSpyObj<SalesApiService>('SalesApiService', [
      'createReturn',
    ]);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAdmin']);
    authService.isAdmin.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        SalesReturnFormService,
        FormBuilder,
        {
          provide: SalesApiService,
          useValue: salesApiService,
        },
        {
          provide: InventoryApiService,
          useValue: {
            getAll: () => of([{ id: 3, type: 'Depósito' }]),
          },
        },
        { provide: AuthService, useValue: authService },
        {
          provide: ToastService,
          useValue: {
            showSuccess: jasmine.createSpy('showSuccess'),
            showWarning: jasmine.createSpy('showWarning'),
          },
        },
      ],
    });
    service = TestBed.inject(SalesReturnFormService);
    form = service.createForm();
    salesApiService.createReturn.and.returnValue(of(void 0));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should require inventory destination for admin', () => {
    service.open(form, mockSale);
    expect(form.get('inventory_destination_id')?.hasError('required')).toBeTrue();
  });

  it('should not require inventory destination for non-admin', () => {
    authService.isAdmin.and.returnValue(false);
    service.open(form, mockSale);
    form.patchValue({
      returner_name: 'Maria',
      reason: 'Defeito',
    });
    service.getItemControls(form)[0].patchValue({ sku_id: 11, quantity: 1 });
    service.onSkuChange(form, 0);

    service.submit(form).subscribe();

    expect(salesApiService.createReturn).toHaveBeenCalled();
    const [, request] = salesApiService.createReturn.calls.mostRecent().args;
    expect(request.inventory_destination_id).toBeNull();
  });

  it('should not allow repeated sku in available options', () => {
    service.open(form, mockSale);
    service.addItemControl(form);
    service.getItemControls(form)[0].patchValue({ sku_id: 11, quantity: 1 });
    service.onSkuChange(form, 0);

    const options = service.getAvailableItems(form, 1);
    expect(options.some((option) => option.sku_id === 11)).toBeFalse();
  });

  it('should enforce max quantity as sold quantity', () => {
    service.open(form, mockSale);
    service.getItemControls(form)[0].patchValue({ sku_id: 11, quantity: 10 });
    service.onSkuChange(form, 0);

    expect(service.getItemControls(form)[0].get('quantity')?.value).toBe(2);
  });
});
