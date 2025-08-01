import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { RouterModule } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { RequiredAsteriscDirective } from './directives/required-asterisc/required-asterisc.directive';
import { ValidatorMessageDirective } from './directives/validator-message.directive';
import { ToastModule } from 'primeng/toast';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const PRIME_NG_MODULES = [
  CardModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  SelectModule,
  ToastModule,
  ConfirmDialogModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TableComponent,
    LoaderComponent,
    RequiredAsteriscDirective,
    ValidatorMessageDirective,
    ToastComponent,
  ],
  exports: [
    ...PRIME_NG_MODULES,
    TableComponent,
    LoaderComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    RequiredAsteriscDirective,
    ValidatorMessageDirective,
    ToastComponent,
  ],
})
export class SharedModule {}
