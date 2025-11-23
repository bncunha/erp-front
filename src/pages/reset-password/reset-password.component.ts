import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  imports: [SharedModule, CardComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [ResetPasswordService],
})
export class ResetPasswordComponent implements OnInit {
  service = inject(ResetPasswordService);

  ngOnInit(): void {
    this.service.initializeParams();
  }
}
