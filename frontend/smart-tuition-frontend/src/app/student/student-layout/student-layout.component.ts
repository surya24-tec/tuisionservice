import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../shared/dashboard-layout/dashboard-layout.component';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../shared/models/menu-item.model';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout
      [menuItems]="menuItems"
      [userName]="userName"
      [userRole]="'Student'">
    </app-dashboard-layout>
  `
})
export class StudentLayoutComponent {
  userName: string = '';

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/student/dashboard' },
    { icon: 'quiz', label: 'Tests', route: '/student/tests' },
    { icon: 'fact_check', label: 'Attendance', route: '/student/attendance' },
    { icon: 'grade', label: 'Marks', route: '/student/marks' },
    { icon: 'auto_stories', label: 'Study Materials', route: '/student/materials' },
    { icon: 'calendar_month', label: 'Timetable', route: '/student/timetable' },
    { icon: 'notifications', label: 'Notifications', route: '/student/notifications' },
  ];

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.userName = user?.name || user?.username || 'Student';
  }
}
