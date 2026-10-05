import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthServiceTs } from '../../core/services/auth.service';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

import { Header } from '../../shared/components/header/header';
import { Navbar, NavItem } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Navbar,
    RouterOutlet
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthServiceTs);
  private readonly sweetAlert = inject(SweetAlertService);

  currentUser = this.authService.getCurrentUser();

  activeItem = '';

  navItems: NavItem[] = [];

  ngOnInit(): void {
    console.log('Usuario actual:', this.currentUser)

    this.loadNavItems();

  }

  private loadNavItems(): void {

    const role = this.currentUser?.rolSistema;

    if (role === 'usuario') {

      this.navItems = [
        {
          label: 'Mi perfil',
          route: '/perfil',
          icon: 'person',
        },
        {
          label: 'Dashboard',
          route: '/home',
          icon: 'dashboard',
        },
      ];

      return;
    }

    if (role === 'admin') {

      this.navItems = [
        {
          label: 'Mi perfil',
          route: '/perfil',
          icon: 'person',
        },
        {
          label: 'Dashboard',
          route: '/admin',
          icon: 'dashboard',
        },
        {
          label: 'Empleados',
          route: 'admin/empleados',
          icon: 'groups'
        },
        {
          label: 'Administrativos',
          route: 'admin/administrativos',
          icon: 'manage_accounts'
        },
        {
          label: 'Directivos',
          route: '/admin/directivos',
          icon: 'supervisor_account'
        },
        {
          label: 'Proveedores',
          route: 'admin/proveedores',
          icon: 'storefront'
        },
        {
          label: 'Documentos',
          route: '/documentos',
          icon: 'description',
        },
        {
          label: 'Configuración',
          route: '/configuracion',
          icon: 'settings',
        },
      ];

      return;
    }

    if (role === 'superAdmin') {

      this.navItems = [
        {
          label: 'Mi perfil',
          route: '/perfil',
          icon: 'person',
        },
        {
          label: 'Dashboard',
          route: '/super-admin',
          icon: 'dashboard',
        },
        {
          label: 'Documentos',
          route: '/documentos',
          icon: 'description',
        },
        {
          label: 'Configuración',
          route: '/configuracion',
          icon: 'settings',
        },
      ];

    }
  }

  onLogout(): void {

    this.authService.logout();
    this.sweetAlert.success('Sesión cerrada correctamente');
    this.router.navigate(['/login']);

  }

  onNotificationClick(): void {
    console.log('Notificaciones');
  }
}
