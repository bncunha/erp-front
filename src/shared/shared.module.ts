import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

const PRIME_NG_MODULES = [CardModule, InputTextModule, ButtonModule];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [...PRIME_NG_MODULES, RouterModule],
})
export class SharedModule {}
