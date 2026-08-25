import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { AdminHome } from './pages/admin-home/admin-home';
import { SuperAdminHome } from './pages/super-admin-home/super-admin-home';

import { authGuard } from './core/guards/auth.guard';
import { UserHome } from './pages/user-home/user-home';

export const routes: Routes = [

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'registro',
    component: Register,
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: UserHome,
    canActivate: [authGuard],
  },

  {
    path: 'admin',
    component: AdminHome,
    canActivate: [authGuard],
  },

  {
    path: 'super-admin',
    component: SuperAdminHome,
    canActivate: [authGuard],
  }

];
