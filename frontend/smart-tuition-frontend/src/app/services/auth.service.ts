
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';

interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

const API_URL = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }


  login(username: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(API_URL + 'signin', { username, password }).pipe(
      tap((response: JwtResponse) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }


  register(name: string, username: string, email: string, password: string, mobileNumber: string, role: string[]): Observable<any> {
    return this.http.post(API_URL + 'signup', { name, username, email, password, mobileNumber, role });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    if (user && user.roles) {
      return user.roles.includes(role);
    }
    return false;
  }
}
