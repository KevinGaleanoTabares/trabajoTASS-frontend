import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: 'profile' | 'dashboard' | 'family' | 'documents' | 'settings';
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
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
