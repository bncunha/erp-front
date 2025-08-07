import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  imports: [SharedModule],
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
