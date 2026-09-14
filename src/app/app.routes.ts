import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { AdminHome } from './pages/admin/admin-home/admin-home';
import { SuperAdminHome } from './pages/super-admin/super-admin-home/super-admin-home';
import { Home } from './features/home/home';

import { authGuard } from './core/guards/auth.guard';
import { UserHome } from './pages/user/user-home/user-home';

import { rolesGuard } from './core/guards/roles.guard';

import { Documents } from './pages/documents/documents';
import { Configuration } from './pages/configuration/configuration';


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
    path: '',
    component: Home,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      // USUARIO
      {
        path: 'home',
        component: UserHome,
        canActivate: [authGuard, rolesGuard],
        data: {
          rolSistema: ['usuario']
        }
      },

      {
        path: 'admin',
        component: AdminHome,
        canActivate: [authGuard, rolesGuard],
        data: {
          rolSistema: ['admin']
        }
      },
      {
        path: 'super-admin',
        component: SuperAdminHome,
        canActivate: [authGuard, rolesGuard],
        data: {
          rolSistema: ['superAdmin'],
        }
      },
      {
        path: 'documentos',
        component: Documents,
        canActivate: [authGuard, rolesGuard],
        data: {
          rolSistema: ['admin', 'superAdmin']
        }
      },
      {
        path: 'configuracion',
        component: Configuration,
        canActivate: [authGuard, rolesGuard],
        data: {
          rolSistema: ['admin', 'superAdmin']
        }
      },
    ],
  },
];
