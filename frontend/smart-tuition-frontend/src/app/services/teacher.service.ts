import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../shared/models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:8080/api/teachers';

  constructor(private http: HttpClient) { }

  getTeachers(page: number, size: number, sortBy: string, sortDir: string, subject?: string, experience?: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (subject) {
      params = params.set('subject', subject);
    }
    if (experience !== undefined && experience !== null) {
      params = params.set('experience', experience.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  getTeacherByUserId(userId: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/user/${userId}`);
  }

  createTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher);
  }

  updateTeacher(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher);
  }

  deleteTeacher(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
