import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TableService } from './table.service';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Column } from './models/column';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    RouterModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [TableService],
})
export class TableComponent implements OnInit {
  @Output() onAddClick = new EventEmitter();
  @Input() stateKey: string = '';
  @Input() keepState: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() showToolbar: boolean = true;
  @Input() columns: Column[] = [];
  @Input() addRoute?: string;
  tableService = inject(TableService);

  filterFields!: string[];

  ngOnInit(): void {
    this.filterFields = this.tableService.getFilterFields(this.columns);
  }
}
