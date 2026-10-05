import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import {
  ConflictStatus,
  DashboardStatsResponse,
  DetectConflictsResponse,
  ConflictsResponse,
  UpdateConflictStatusResponse,
} from '../../utils/interface_enums_types';

@Injectable({
  providedIn: 'root',
})
export class ConflictService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiconflicts;

  getDashboardStats(): Observable<DashboardStatsResponse> {

    return this.http.get<DashboardStatsResponse>(
      `${this.apiUrl}/dashboard-stats`,
    );
  }

  detectConflicts(): Observable<DetectConflictsResponse> {
    return this.http.post<DetectConflictsResponse>(
      `${this.apiUrl}/detect`,
      {}
    );
  }

  getConflicts(): Observable<ConflictsResponse> {
  return this.http.get<ConflictsResponse>(
    this.apiUrl,
  );
}

  updateConflictStatus(id: string, estado: ConflictStatus): Observable<UpdateConflictStatusResponse> {
    return this.http.put<UpdateConflictStatusResponse>(`${this.apiUrl}/${id}/status`, { estado });
  }

  generateReport(formato: 'pdf' | 'excel'): Observable<Blob> {

    return this.http.post(`${this.apiUrl}/report`, { formato }, { responseType:'blob' });
  }

}
