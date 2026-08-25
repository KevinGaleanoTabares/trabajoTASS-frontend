import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  tipoVinculacion: string;
  cargo: string;
  empresaProveedora?: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      nombres: string;
      correo: string;
      estado: string;
    };
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    estado: string;
  };
}

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
        })
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); //Atob lo decodifica, token.split('.')[1] obtiene la segunda parte del token que es el payload

      return payload.rol ?? null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
