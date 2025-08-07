import { Component, inject } from '@angular/core';
import { SidebarTemplateService } from '../../templates/sidebar-template/sidebar-template.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [SidebarTemplateService],
})
export class DashboardComponent {
  sidebarService = inject(SidebarTemplateService);

  menuItems = this.sidebarService
    .getMenuItems()
    .filter((item) => item.name !== 'Início');
}
