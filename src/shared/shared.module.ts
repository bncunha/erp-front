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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { RequiredAsteriscDirective } from './directives/required-asterisc/required-asterisc.directive';
import { ValidatorMessageDirective } from './directives/validator-message/validator-message.directive';
import { DropdownModule } from 'primeng/dropdown';
import { ToastComponent } from './components/toast/toast.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormGroupRequiredAsteriscDirective } from './directives/required-asterisc/form-group-required-asterisc.directive.';
import { MultiSelectModule } from 'primeng/multiselect';
import { DrawerModule } from 'primeng/drawer';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';

const PRIME_NG_MODULES = [
  CardModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  SelectModule,
  DropdownModule,
  InputNumberModule,
  MultiSelectModule,
  DrawerModule,
  ChipModule,
  PanelModule,
  DatePickerModule,
  SkeletonModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TableComponent,
    LoaderComponent,
    RequiredAsteriscDirective,
    FormGroupRequiredAsteriscDirective,
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
    ReactiveFormsModule,
    RequiredAsteriscDirective,
    FormGroupRequiredAsteriscDirective,
    ValidatorMessageDirective,
    ToastComponent,
  ],
})
export class SharedModule {}
