import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkuListComponent } from './sku-list.component';

describe('SkuListComponent', () => {
  let component: SkuListComponent;
  let fixture: ComponentFixture<SkuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SkuListComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
