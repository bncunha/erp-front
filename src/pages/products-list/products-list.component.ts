import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductsListService } from './products-list.service';

@Component({
  selector: 'app-products-list',
  imports: [SharedModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  providers: [ProductsListService],
})
export class ProductsListComponent {
  service = inject(ProductsListService);
}
