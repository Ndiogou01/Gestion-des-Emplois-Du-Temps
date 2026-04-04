import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Userservice {
  private apiUrl = 'http://127.0.0.1:9990/admin/api/users/me';

  private username = 'sns';
  private password = 'root';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.apiUrl,  {
      headers: this.getAuthHeaders()
    });
  }
}
