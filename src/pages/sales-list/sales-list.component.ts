import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SalesListService } from './sales-list.service';

@Component({
  selector: 'app-sales-list',
  imports: [SharedModule],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
  providers: [SalesListService],
})
export class SalesListComponent {
  service = inject(SalesListService);

  columns = this.service.getColumns();
}
