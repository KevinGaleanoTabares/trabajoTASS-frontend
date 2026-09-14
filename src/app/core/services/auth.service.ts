import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { RegisterRequest, LoginRequest, LoginResponse, RegisterResponse, AuthUser } from '../../utils/interface_enums_types'

@Injectable({
  providedIn: 'root',
})

export class AuthServiceTs {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.data.token);
          console.log("respuesta", response)

          const token = localStorage.getItem('token');

          if (token) {
            const payload = JSON.parse(
              atob(token.split('.')[1])
            );

            console.log('Datos del usuario dentro del token:', payload);
            console.log("Nombre completo", payload.nombres, payload.apellidos)
          }
        })
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    const user = this.getCurrentUser();

    return user?.rolSistema ?? null;
  }

  getCurrentUser(): AuthUser | null {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return {
        id: payload.id,
        nombres: payload.nombres,
        apellidos: payload.apellidos,
        correo: payload.correo,
        tipoDocumento: payload.tipoDocumento,
        numeroDocumento: payload.numeroDocumento,
        telefono: payload.telefono,
        tipoVinculacion: payload.tipoVinculacion,
        rolSistema: payload.rolSistema,
        cargo: payload.cargo,
        estado: payload.estado,
      };
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
