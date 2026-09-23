import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthServiceTs } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (request, next) => {

  const token = localStorage.getItem('token');
  const authService = inject(AuthServiceTs);
  const router = inject(Router);

  if(!token) {
    return next(request);
  }

  const cloneRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloneRequest).pipe(

    catchError((error) => {

      if (error.status === 401) {

        authService.logout();
        router.navigate(['/login']);

      }

      return throwError(() => error);
    })
  );
};
