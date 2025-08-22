import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from './users.service';
import { UsersFormDialogComponent } from './users-form-dialog/users-form-dialog.component';

@Component({
  selector: 'app-users',
  imports: [SharedModule, UsersFormDialogComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [UsersService],
})
export class UsersComponent {
  service = inject(UsersService);

  users = this.service.getAll();
  columns = this.service.getColumns();
}
