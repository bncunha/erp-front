import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterService } from './register.service';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    CheckboxModule,
    SharedModule,
    CardComponent
  ],
  providers: [RegisterService],
})
export class RegisterComponent {
  @ViewChild('f') form!: NgForm;

  service = inject(RegisterService);
  isLoading = false;

  handleSubmit(form: NgForm) {
    this.isLoading = true;
    this.service.submit(form).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        throw err;
      }
    });
  }
}
