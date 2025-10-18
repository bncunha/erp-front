import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesProductsFormComponent } from './sales-products-form.component';

describe('SalesProductsFormComponent', () => {
  let component: SalesProductsFormComponent;
  let fixture: ComponentFixture<SalesProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesProductsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
