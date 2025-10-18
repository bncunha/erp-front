import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NgForm } from '@angular/forms';
import { CustomersFormService } from './customers-form.service';
import { ActivatedRoute } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customers-form',
  imports: [SharedModule, InputMaskModule],
  templateUrl: './customers-form.component.html',
  styleUrl: './customers-form.component.scss',
  providers: [CustomersFormService],
})
export class CustomersFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;

  service = inject(CustomersFormService);
  route = inject(ActivatedRoute);

  id?: number;
  isLoading = false;
  sub!: Subscription;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sub = this.route.params.subscribe((params) => {
        this.id = params['id'];
        this.service.load(this.id as number, this.form);
      });
    });
  }

  handleSubmit(form: NgForm) {
    this.isLoading = true;
    this.service.submit(form, this.id).subscribe(
      () => {
        this.isLoading = false;
        this.service.backPage();
      },
      (err) => {
        this.isLoading = false;
        throw err;
      },
      () => (this.isLoading = false)
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
