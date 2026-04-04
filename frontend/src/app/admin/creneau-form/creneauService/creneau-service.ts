import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Creneau {
  id?: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  coursId: number;
  enseignantId: number;
  salleId: number;
  planningHebdomadaireId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreneauService {
  private apiUrl = 'http://127.0.0.1:9990/api/creneaux';

  private username = 'sns';
  private password = 'root';
  
  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }
  getAll(): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(this.apiUrl,  {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<Creneau> {
    return this.http.get<Creneau>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(creneau: Partial<Creneau>): Observable<Creneau> {
    return this.http.post<Creneau>(this.apiUrl, creneau, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, creneau: Partial<Creneau>): Observable<Creneau> {
    return this.http.put<Creneau>(`${this.apiUrl}/${id}`, creneau, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getByPlanningHebdomadaire(planningHebdomadaireId: number): Observable<Creneau[]> {
    const url = `${this.apiUrl}?planningHebdomadaireId=${planningHebdomadaireId}`;
    return this.http.get<Creneau[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
  
}
