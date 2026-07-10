import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../shared/dashboard-layout/dashboard-layout.component';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../shared/models/menu-item.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout
      [menuItems]="menuItems"
      [userName]="userName"
      [userRole]="'Administrator'">
    </app-dashboard-layout>
  `
})
export class AdminLayoutComponent {
  userName: string = '';

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'person_outline', label: 'Teacher Management', route: '/admin/teachers' },
    { icon: 'school', label: 'Student Management', route: '/admin/students' },
    { icon: 'menu_book', label: 'Course Management', route: '/admin/courses' },
    { icon: 'groups', label: 'Batch Management', route: '/admin/batches' },
    { icon: 'payments', label: 'Fee Management', route: '/admin/fees' },
    { icon: 'fact_check', label: 'Attendance', route: '/admin/attendance' },
    { icon: 'assessment', label: 'Reports', route: '/admin/reports' },
    { icon: 'notifications', label: 'Notifications', route: '/admin/notifications' },
    { icon: 'settings', label: 'Settings', route: '/admin/settings' },
  ];

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.userName = user?.name || user?.username || 'Admin';
  }
}
