import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Filiere {
  id?: number;         
  nomFiliere: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private apiUrl = 'http://127.0.0.1:9990/api/filieres'; 

  private username = 'sns';
  private password = 'root';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }

  getAll(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(this.apiUrl, filiere, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, filiere: Filiere): Observable<Filiere> {
    return this.http.put<Filiere>(`${this.apiUrl}/${id}`, filiere, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
