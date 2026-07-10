import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../shared/models/teacher.model';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './teacher-profile.component.html'
})
export class TeacherProfileComponent implements OnInit {
  profile: Teacher | null = null;
  isLoading = true;
  userName = '';

  constructor(
    private authService: AuthService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.name || user?.username || 'Teacher';
    if (user?.id) {
      this.teacherService.getTeacherByUserId(user.id).subscribe({
        next: (data) => { this.profile = data; this.isLoading = false; },
        error: () => { this.isLoading = false; }
      });
    } else {
      this.isLoading = false;
    }
  }

  getInitials(): string {
    return this.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
