import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TableComponent } from './components/table/table.component';

const PRIME_NG_MODULES = [CardModule, InputTextModule, ButtonModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, TableComponent],
  exports: [...PRIME_NG_MODULES, TableComponent, RouterModule],
})
export class SharedModule {}
