import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceTs } from '../services/auth.service';

export const rolesGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthServiceTs);

  const rolUsuario = authService.getRole();
  const rolesPermitidos = route.data['rolSistema'] as string[];

  if (!rolUsuario || !rolesPermitidos || rolesPermitidos.length == 0 || !rolesPermitidos.includes(rolUsuario)) {
    return router.parseUrl('/home');
  }

  return true;
};
