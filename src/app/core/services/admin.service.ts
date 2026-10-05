import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AdministratorsResponse } from '../../utils/interface_enums_types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apico;

  getAdministrators(): Observable<AdministratorsResponse> {
    return this.http.get<AdministratorsResponse>(`${this.apiUrl}/admin/administrators`);
  }
}
