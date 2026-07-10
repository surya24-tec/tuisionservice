import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboardStats, TeacherDashboardStats, StudentDashboardStats } from '../shared/models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin`);
  }

  getTeacherStats(userId: number): Observable<TeacherDashboardStats> {
    return this.http.get<TeacherDashboardStats>(`${this.apiUrl}/teacher/${userId}`);
  }

  getStudentStats(userId: number): Observable<StudentDashboardStats> {
    return this.http.get<StudentDashboardStats>(`${this.apiUrl}/student/${userId}`);
  }
}
