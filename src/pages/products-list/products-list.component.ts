import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductsListService } from './products-list.service';
import { GetProductResponse } from '../../service/responses/products-response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products-list',
  imports: [SharedModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  providers: [ProductsListService],
})
export class ProductsListComponent {
  service = inject(ProductsListService);

  products: Observable<GetProductResponse[]> = this.service.getAll();
  columns = this.service.getColumns();
}
