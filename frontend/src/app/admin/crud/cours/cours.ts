import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cours {
  id?: number;
  nomCours: string;
  typeDeCours: string;
  enseignantResponsableId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl = 'http://127.0.0.1:9990/api/cours';

  private username = 'sns';
  private password = 'root';

  coursCache: Cours[] = [];
  
  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }
  
  getAll(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl,  {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(cours: Partial<Cours>): Observable<Cours> {
    return this.http.post<Cours>(this.apiUrl, cours, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, cours: Partial<Cours>): Observable<Cours> {
    return this.http.put<Cours>(`${this.apiUrl}/${id}`, cours, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  chargerCours(): void {
    this.getAll().subscribe(data => this.coursCache = data);
  }

  getNomById(id: number): string {
    return this.coursCache.find(c => c.id === id)?.nomCours || '';
  }

  getTypeById(id: number): string {
    return this.coursCache.find(c => c.id === id)?.typeDeCours || '';
  }

  getByFiliere(filiereId: number): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/filiere/${filiereId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  getAllDistinct(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/distinct`);
  }
  
}
