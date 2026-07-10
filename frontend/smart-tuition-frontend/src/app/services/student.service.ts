import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../shared/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  /** Get all students with pagination, sorting, and filters */
  getStudents(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    sortDir: string = 'asc',
    search?: string,
    studentClass?: string,
    batchId?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (search) params = params.set('search', search);
    if (studentClass) params = params.set('studentClass', studentClass);
    if (batchId !== undefined && batchId !== null) params = params.set('batchId', batchId.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Get student profile by user id */
  getStudentByUserId(userId: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/user/${userId}`);
  }
}
