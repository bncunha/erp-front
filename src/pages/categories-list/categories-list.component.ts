import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CategoriesService } from './categories.service';
import { GetCategoriesResponse } from '../../service/responses/categories-response';
import { Observable } from 'rxjs';
import { CategoriresFormDialogComponent } from './categorires-form-dialog/categorires-form-dialog.component';

@Component({
  selector: 'app-categories-list',
  imports: [SharedModule, CategoriresFormDialogComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
  providers: [CategoriesService],
})
export class CategoriesListComponent {
  service = inject(CategoriesService);

  categories: Observable<GetCategoriesResponse[]> = this.service.getAll();
}
