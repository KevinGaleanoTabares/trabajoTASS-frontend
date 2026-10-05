import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Input() showProfile = false;

  @Output() notificationClick = new EventEmitter<void>();

  private readonly userDetails = this.getUserDetails();
  nombreUsuario = `${this.userDetails?.nombres ?? ''} ${this.userDetails?.apellidos ?? ''}`.trim();
  inicialesUsuario = this.getInitials();

  private getUserDetails(): { nombres?: string; apellidos?: string } | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private getInitials(): string {
    const firstName = this.userDetails?.nombres?.trim().charAt(0) ?? '';
    const lastName = this.userDetails?.apellidos?.trim().charAt(0) ?? '';
    return `${firstName}${lastName}`.toLocaleUpperCase() || 'U';
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }
}
