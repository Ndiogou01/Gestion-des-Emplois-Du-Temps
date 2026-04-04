import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlanningHebdomadaire {
  id?: number;
  filiereId: number;
  semaineAnnee: string;
  dateDebut: Date | string;
  dateFin: Date | string;
  statut?: string;
  semestre: string;
  dateCreation?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningHebdomadaireService {
  private apiUrl = 'http://127.0.0.1:9990/api/planning';

  private username = 'sns';
  private password = 'root';
  
  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }

  getAll(): Observable<PlanningHebdomadaire[]> {
    return this.http.get<PlanningHebdomadaire[]>(this.apiUrl,  {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<PlanningHebdomadaire> {
    return this.http.get<PlanningHebdomadaire>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(planningHebdomadaire: Partial<PlanningHebdomadaire>): Observable<PlanningHebdomadaire> {
    return this.http.post<PlanningHebdomadaire>(this.apiUrl, planningHebdomadaire, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, planningHebdomadaire: Partial<PlanningHebdomadaire>): Observable<PlanningHebdomadaire> {
    return this.http.put<PlanningHebdomadaire>(`${this.apiUrl}/${id}`, planningHebdomadaire, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getPlanningActifByFiliere(filiereId: number): Observable<PlanningHebdomadaire> {
    return this.http.get<PlanningHebdomadaire>(`${this.apiUrl}/actif/${filiereId}`, {
      headers: this.getAuthHeaders()
    });
  }  

}
