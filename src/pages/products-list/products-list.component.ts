import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductsListService } from './products-list.service';
import { GetProductResponse } from '../../service/responses/products-response';
import { Observable } from 'rxjs';
import { SkuListComponent } from '../products-form/sku-list/sku-list.component';

@Component({
  selector: 'app-products-list',
  imports: [SharedModule, SkuListComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  providers: [ProductsListService],
})
export class ProductsListComponent {
  service = inject(ProductsListService);

  products: Observable<GetProductResponse[]> = this.service.getAll();
  columns = this.service.getColumns();
  drawerVisible = false;
  isLoadingSkus = false;
  selectedProduct?: GetProductResponse;

  openDrawer(product: GetProductResponse) {
    this.selectedProduct = product;
    this.drawerVisible = true;
    this.isLoadingSkus = !this.service.hasSkus(product.id);

    this.service.loadSkus(product.id).subscribe({
      next: () => (this.isLoadingSkus = false),
      error: () => (this.isLoadingSkus = false),
    });
  }

  onDrawerHide() {
    this.drawerVisible = false;
    this.selectedProduct = undefined;
    this.isLoadingSkus = false;
  }
}
