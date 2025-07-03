import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  imports: [SharedModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [UsersService],
})
export class UsersComponent {
  service = inject(UsersService);

  columns = this.service.getColumns();
}
