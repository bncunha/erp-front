import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from '../models/menu-item';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, ButtonModule, CommonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Output() onClose = new EventEmitter();
  @Output() desktopCollapsedChange = new EventEmitter<boolean>();
  @Input() isOpen: boolean = false;
  @Input() itemsList: MenuItem[] = [];
  @Input() isDesktopCollapsed: boolean = false;
  expandedMenus: Record<string, boolean> = {};

  toggleParent(itemName: string): void {
    this.expandedMenus[itemName] = !this.expandedMenus[itemName];
  }

  toggleDesktopCollapsed(): void {
    this.isDesktopCollapsed = !this.isDesktopCollapsed;
    this.desktopCollapsedChange.emit(this.isDesktopCollapsed);
  }

  isExpanded(itemName: string): boolean {
    return !!this.expandedMenus[itemName];
  }
}
