import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../shared/dashboard-layout/dashboard-layout.component';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../shared/models/menu-item.model';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout
      [menuItems]="menuItems"
      [userName]="userName"
      [userRole]="'Teacher'">
    </app-dashboard-layout>
  `
})
export class TeacherLayoutComponent {
  userName: string = '';

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/teacher/dashboard' },
    { icon: 'person_add', label: 'Add Students', route: '/teacher/students' },
    { icon: 'fact_check', label: 'Mark Attendance', route: '/teacher/attendance' },
    { icon: 'upload_file', label: 'Upload Study Materials', route: '/teacher/materials' },
    { icon: 'assignment', label: 'Conduct Tests', route: '/teacher/tests' },
    { icon: 'grade', label: 'Upload Marks', route: '/teacher/marks' },
    { icon: 'analytics', label: 'View Student Performance', route: '/teacher/performance' },
    { icon: 'notifications', label: 'Send Notifications', route: '/teacher/notifications' },
  ];

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.userName = user?.name || user?.username || 'Teacher';
  }
}
