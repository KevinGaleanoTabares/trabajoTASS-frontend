import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompanyResponse {
  success: boolean;
  data: {
    _id: string;
    nit: string;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/company';

  findByNit(nit: string): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.apiUrl}/nit/${nit}`);
  } //controlar en caso falla
}
