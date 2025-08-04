import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TextareaModule } from 'primeng/textarea';
import { SkuListComponent } from './sku-list/sku-list.component';
import { ProductsFormService } from './products-form.service';
import { GetCategoriesResponse } from '../../service/responses/categories-response';
import { Observable } from 'rxjs';
import { CategoriresFormDialogComponent } from '../categories-list/categorires-form-dialog/categorires-form-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-products-form',
  imports: [
    SharedModule,
    AutoCompleteModule,
    TextareaModule,
    SkuListComponent,
    CategoriresFormDialogComponent,
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
  providers: [ProductsFormService],
})
export class ProductsFormComponent implements AfterViewInit {
  @ViewChild('f') form!: NgForm;

  service: ProductsFormService = inject(ProductsFormService);
  activatedRoute = inject(ActivatedRoute);

  id?: number;
  categories: Observable<GetCategoriesResponse[]> =
    this.service.getCategories();

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.service.getProduct(this.id as number, this.form);
    });
  }

  handleSubmit(form: any) {
    this.service.submitForm(form, this.id).subscribe((insertedId) => {
      this.service.backPage(insertedId);
    });
  }
}
