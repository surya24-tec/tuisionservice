import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../shared/models/teacher.model';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {
  profile!: Teacher;
  isLoading = false;
  isEditing = false;
  editedProfile!: Teacher;
  userName = '';

  constructor(
    private authService: AuthService,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.name || user?.username || 'Teacher';
    
    // Load from localStorage first for instant display
    const storedProfile = this.readStorage('teacher_profile');
    if (storedProfile) {
      this.profile = storedProfile;
    } else {
      // Create fallback profile if no stored data
      this.profile = {
        name: this.userName,
        email: user?.email || 'teacher@example.com',
        mobileNumber: user?.mobileNumber || '+1 234 567 8900',
        teachingSubject: 'Mathematics',
        experience: 5,
        salary: 50000,
        address: '123 Education Street, Learning City',
        joiningDate: '2022-01-15',
        status: 'Active'
      };
      localStorage.setItem('teacher_profile', JSON.stringify(this.profile));
    }

    // Try to load from API in background
    if (user?.id) {
      this.teacherService.getTeacherByUserId(user.id).subscribe({
        next: (data) => { 
          this.profile = data; 
          localStorage.setItem('teacher_profile', JSON.stringify(data));
        },
        error: () => {}
      });
    }
  }

  getInitials(): string {
    return this.profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editedProfile = { ...this.profile };
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    this.profile = { ...this.editedProfile };
    localStorage.setItem('teacher_profile', JSON.stringify(this.profile));
    this.isEditing = false;
    this.showSnack('Profile updated successfully!', 'success');
  }

  private readStorage(key: string): Teacher | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private showSnack(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}
