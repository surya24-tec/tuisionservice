import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentData: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.id) {
      this.http.get(`http://localhost:8080/api/students/user/${currentUser.id}`).subscribe({
        next: (data) => {
          this.studentData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching student dashboard data:', err);
          this.error = 'Failed to load student profile details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No logged-in user session found.';
      this.loading = false;
    }
  }
}
