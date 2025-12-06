import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    CheckboxModule,
  ],
  providers: [RegisterService],
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') form!: NgForm;
  isLoading = false;

  service = inject(RegisterService);

  ngOnInit(): void {
    this.service.updateSteps();
  }

  handleSubmit(form: NgForm) {
    this.isLoading = true;
    this.service.submit(form).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        throw err;
      },
    });
  }
}
