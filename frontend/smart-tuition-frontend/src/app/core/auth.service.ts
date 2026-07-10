import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserRole } from './models/user-role.enum';

export interface AuthResponse {
  token: string;
  role: UserRole;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'auth_role';
  private readonly nameKey = 'auth_name';

  private userRoleSubject = new BehaviorSubject<UserRole | null>(this.getStoredRole());
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Perform login request. On success stores JWT and role in localStorage.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.roleKey, res.role);
        localStorage.setItem(this.nameKey, res.userName);
        this.userRoleSubject.next(res.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.nameKey);
    this.userRoleSubject.next(null);
  }

  /** Returns true if a JWT token is present. */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /** Returns stored role or null */
  getUserRole(): UserRole | null {
    return this.getStoredRole();
  }

  private getStoredRole(): UserRole | null {
    const role = localStorage.getItem(this.roleKey);
    if (role) {
      return role as UserRole;
    }
    return null;
  }

  /** Helper to attach token to HttpHeaders when needed */
  getAuthHeaders() {
    const token = localStorage.getItem(this.tokenKey) ?? '';
    return { Authorization: `Bearer ${token}` };
  }
}
