import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Salle {
  id?: number;         
  nomSalle: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private apiUrl = 'http://127.0.0.1:9990/api/salles'; 
  sallesCache: Salle[] = [];
  private username = 'sns';
  private password = 'root';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }

  getAll(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, salle: Salle): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  chargerSalles(): void {
    this.getAll().subscribe(data => this.sallesCache = data);
  }
  
  getNomById(id: number): string {
    return this.sallesCache.find(s => s.id === id)?.nomSalle || '';
  }
}
