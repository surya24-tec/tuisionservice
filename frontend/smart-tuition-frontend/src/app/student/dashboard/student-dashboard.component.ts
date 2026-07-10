import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardCardsComponent } from '../../shared/widgets/dashboard-cards/dashboard-cards.component';
import { TimetableWidgetComponent } from '../../shared/widgets/timetable/timetable.component';
import { NotificationsWidgetComponent } from '../../shared/widgets/notifications/notifications.component';
import { QuickAccessWidgetComponent, QuickAction } from '../../shared/widgets/quick-access/quick-access.component';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { StatCard } from '../../shared/models/dashboard-stats.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    DashboardCardsComponent,
    TimetableWidgetComponent,
    NotificationsWidgetComponent,
    QuickAccessWidgetComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  isLoading = true;
  studentName = '';
  userId = 0;

  statCards: StatCard[] = [
    { title: 'Attendance', value: '0%', icon: 'fact_check', color: '#6366f1' },
    { title: 'Total Marks', value: 0, icon: 'grade', color: '#10b981' },
    { title: 'Pending Fees', value: '₹0', icon: 'pending_actions', color: '#ef4444' },
    { title: 'Study Materials', value: 0, icon: 'auto_stories', color: '#f59e0b' },
    { title: 'Upcoming Tests', value: 0, icon: 'quiz', color: '#8b5cf6' },
    { title: 'Classes Today', value: 0, icon: 'event', color: '#3b82f6' },
  ];

  // Quick Action Buttons
  quickActions: QuickAction[] = [
    { label: 'View Attendance', icon: 'fact_check', route: '/student/attendance', color: '#6366f1' },
    { label: 'View Marks', icon: 'grade', route: '/student/marks', color: '#10b981' },
    { label: 'View Profile', icon: 'person', route: '/student/profile', color: '#ef4444' },
    { label: 'Download Materials', icon: 'cloud_download', route: '/student/materials', color: '#f59e0b' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.studentName = user?.name || user?.username || 'Student';
    this.userId = user?.id || 0;

    if (user && user.id) {
      this.dashboardService.getStudentStats(user.id).subscribe({
        next: (data: any) => {
          if (data) {
            this.statCards[0].value = (data.attendance || 0) + '%';
            this.statCards[1].value = data.totalMarks || 0;
            this.statCards[2].value = '₹' + (data.pendingFees || 0).toLocaleString();
            this.statCards[3].value = data.materialsCount || 0;
            this.statCards[4].value = data.upcomingTests || 0;
            this.statCards[5].value = data.classesToday || 0;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }
}
