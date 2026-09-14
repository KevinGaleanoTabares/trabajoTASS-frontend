import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Input() showProfile = false;

  @Output() notificationClick = new EventEmitter<void>();

  nombreUsuario = this.getUserName();

  private getUserName(): string {
    if (typeof localStorage === 'undefined') {
      return '';
    }

    const token = localStorage.getItem('token');

    if (!token) {
      return '';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return `${payload.nombres ?? ''} ${payload.apellidos ?? ''}`.trim();
    } catch {
      return '';
    }
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }
}
