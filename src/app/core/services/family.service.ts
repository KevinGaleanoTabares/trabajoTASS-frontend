import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { CreateFamilyRelationshipRequest, FamilyRelationshipsResponse, CreateFamilyRelationshipResponse } from '../../utils/interface_enums_types';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apico;

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getFamilyRelationships(): Observable<FamilyRelationshipsResponse> {
    return this.http.get<FamilyRelationshipsResponse>(`${this.apiUrl}/families`,
      {
        headers: this.getHeaders(),
      },
    );
  }

  createFamilyRelationship( data: CreateFamilyRelationshipRequest, ): Observable<CreateFamilyRelationshipResponse> {
    return this.http.post<CreateFamilyRelationshipResponse>(
      `${this.apiUrl}/families`,
      data,
      {
        headers: this.getHeaders(),
      },
    );
  }
}
