import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DatePickerModule } from 'primeng/datepicker';
import { ItemsListComponent } from './items-list/items-list.component';

@Component({
  selector: 'app-sales-form',
  imports: [SharedModule, DatePickerModule, ItemsListComponent],
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss',
})
export class SalesFormComponent {}
