import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SuiviCours {
  id?: number;
  coursId: number;
  dateCours: string;
  duree: number;
  typeDeCours: string;
  enseignantId: number;
  creneauId: number;
  filiereId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:9990/api/suivi-cours';

  private username = 'sns';
  private password = 'root';

  coursCache: SuiviCours[] = [];
  
  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }
  
  getAll(): Observable<SuiviCours[]> {
    return this.http.get<SuiviCours[]>(this.apiUrl,  {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<SuiviCours> {
    return this.http.get<SuiviCours>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(suivicours: Partial<SuiviCours>): Observable<SuiviCours> {
    return this.http.post<SuiviCours>(this.apiUrl, suivicours, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, suiviCours: Partial<SuiviCours>): Observable<SuiviCours> {
    return this.http.put<SuiviCours>(`${this.apiUrl}/${id}`, suiviCours, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getProgressionByFiliere(filiereId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/progression/${filiereId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
}

