import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  teacherData: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.id) {
      this.http.get(`http://localhost:8080/api/teachers/user/${currentUser.id}`).subscribe({
        next: (data) => {
          this.teacherData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching teacher dashboard data:', err);
          this.error = 'Failed to load teacher profile details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No logged-in user session found.';
      this.loading = false;
    }
  }
}
