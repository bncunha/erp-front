import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  imports: [SharedModule, CardComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [ForgotPasswordService],
})
export class ForgotPasswordComponent {
  service = inject(ForgotPasswordService);
}
