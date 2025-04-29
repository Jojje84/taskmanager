import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent {
  @Output() sidebarToggle = new EventEmitter<boolean>(); // Skicka ett boolean-värde
  isOpen = true;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen); // Skicka det nya tillståndet som boolean
  }
}
