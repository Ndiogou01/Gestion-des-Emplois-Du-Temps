import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enseignant {
  id?: number;
  departement: string;
  nomEnseignant: string;
  prenomEnseignant: string;
  specialite: string;
  emailEnseignant: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = 'http://127.0.0.1:9990/api/enseignants';
  enseignantsCache: Enseignant[] = [];
  private username = 'sns';
  private password = 'root';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }

  getAll(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.apiUrl, enseignant, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, enseignant: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, enseignant, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }



  chargerEnseignants(): void {
    this.getAll().subscribe(data => this.enseignantsCache = data);
  }

  getNomById(id: number): string {
    const e = this.enseignantsCache.find(e => e.id === id);
    return e ? `${e.prenomEnseignant} ${e.nomEnseignant}` : '';
  }

  getByFiliere(filiereId: number): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}/filiere/${filiereId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
