import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomersListService } from './customers-list.service';
import { Observable } from 'rxjs';
import { GetCustomerResponse } from '../../service/responses/customers-response';

@Component({
  selector: 'app-customers-list',
  imports: [SharedModule],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
  providers: [CustomersListService],
})
export class CustomersListComponent {
  service = inject(CustomersListService);

  customers: Observable<GetCustomerResponse[]> = this.service.getAll();
  columns = this.service.getColumns();
}

