import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoginService } from './login.service';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-login',
  imports: [SharedModule, CardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginService],
})
export class LoginComponent implements OnInit {
  service = inject(LoginService);

  ngOnInit(): void {
    this.service.cleanUserData();
  }
}
