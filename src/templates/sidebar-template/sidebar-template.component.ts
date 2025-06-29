import { Component, inject } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { SidebarTemplateService } from './sidebar-template.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-template',
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterModule],
  templateUrl: './sidebar-template.component.html',
  styleUrl: './sidebar-template.component.scss',
  providers: [SidebarTemplateService],
})
export class SidebarTemplateComponent {
  sidebarTemplateService = inject(SidebarTemplateService);

  isSidebarOpen$ = this.sidebarTemplateService.getIsSidebarOpen$();
  itemsList = this.sidebarTemplateService.getMenuItems();
}
