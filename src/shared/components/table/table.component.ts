import {
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
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
  @ContentChild('actions') actionsTemplate?: TemplateRef<any>;
  @ContentChild('rowExpand') rowExpandTemplate?: TemplateRef<any>;

  @Output() onAddClick = new EventEmitter();
  @Output() onEditClick = new EventEmitter<any>();
  @Output() onDeleteClick = new EventEmitter<any>();
  @Output() onRowExpand = new EventEmitter<any>();
  @Output() onRowCollapse = new EventEmitter<any>();
  @Input() value!: any[];
  @Input() stateKey?: string;
  @Input() keepState: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showAdd: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() showToolbar: boolean = true;
  @Input() disableCreate: boolean = false;
  @Input() columns: Column[] = [];
  @Input() addRoute?: string;
  @Input() dataKey?: string;

  selected?: any;
  tableService = inject(TableService);

  filterFields!: string[];
  initialSearch?: string;

  ngOnInit(): void {
    this.filterFields = this.tableService.getFilterFields(this.columns);
    this.initialSearch = this.tableService.getInitialSearch(this.stateKey);
  }
}
