import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FiliereCours {
  id?: number;
  filiereId: number;
  coursId: number;
  volumeHoraireTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class FiliereCoursService {
  private apiUrl = 'http://127.0.0.1:9990/api/filiere-cours';

  private username = 'sns';
  private password = 'root';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }

  getAll(): Observable<FiliereCours[]> {
    return this.http.get<FiliereCours[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<FiliereCours> {
    return this.http.get<FiliereCours>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(fc: FiliereCours): Observable<FiliereCours> {
    return this.http.post<FiliereCours>(this.apiUrl, fc, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, fc: FiliereCours): Observable<FiliereCours> {
    return this.http.put<FiliereCours>(`${this.apiUrl}/${id}`, fc, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
