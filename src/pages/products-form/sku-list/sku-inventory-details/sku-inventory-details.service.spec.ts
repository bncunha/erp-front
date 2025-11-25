import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SkuInventoryDetailsService } from './sku-inventory-details.service';

describe('SkuInventoryDetailsService', () => {
  let service: SkuInventoryDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkuInventoryDetailsService],
    });
    service = TestBed.inject(SkuInventoryDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
