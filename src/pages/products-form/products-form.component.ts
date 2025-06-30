import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TextareaModule } from 'primeng/textarea';
import { SkuListComponent } from './sku-list/sku-list.component';

@Component({
  selector: 'app-products-form',
  imports: [SharedModule, AutoCompleteModule, TextareaModule, SkuListComponent],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent {}
