import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  @Input() activeItem = '';

  @Input() items: NavItem[] = [];

  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }


}
