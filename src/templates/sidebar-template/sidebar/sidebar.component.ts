import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../models/menu-item';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Output() onClose = new EventEmitter();
  @Input() isOpen: boolean = false;
  @Input() itemsList: MenuItem[] = [];
}
