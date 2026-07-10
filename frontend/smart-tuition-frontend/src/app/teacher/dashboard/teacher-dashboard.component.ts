import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardCardsComponent } from '../../shared/widgets/dashboard-cards/dashboard-cards.component';
import { ChartsComponent } from '../../shared/widgets/charts/charts.component';
import { QuickAccessWidgetComponent, QuickAction } from '../../shared/widgets/quick-access/quick-access.component';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { StatCard } from '../../shared/models/dashboard-stats.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    DashboardCardsComponent,
    ChartsComponent,
    QuickAccessWidgetComponent
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  isLoading = true;
  teacherName = '';

  statCards: StatCard[] = [
    { title: 'Total Students', value: 0, icon: 'school', color: '#6366f1' },
    { title: 'Attendance %', value: '0%', icon: 'fact_check', color: '#10b981' },
    { title: 'Total Tests', value: 0, icon: 'quiz', color: '#f59e0b' },
    { title: 'Study Materials', value: 0, icon: 'auto_stories', color: '#8b5cf6' },
    { title: 'Upcoming Classes', value: 0, icon: 'event', color: '#14b8a6' },
    { title: 'Pending Evaluations', value: 0, icon: 'rate_review', color: '#ef4444' },
  ];

  // Quick Action Buttons
  quickActions: QuickAction[] = [
    { label: 'Add Student', icon: 'person_add', route: '/teacher/students', color: '#6366f1' },
    { label: 'Mark Attendance', icon: 'done_all', route: '/teacher/attendance', color: '#10b981' },
    { label: 'Upload Materials', icon: 'upload_file', route: '/teacher/materials', color: '#8b5cf6' },
    { label: 'Conduct Test', icon: 'assignment', route: '/teacher/tests', color: '#f59e0b' },
    { label: 'Upload Marks', icon: 'grade', route: '/teacher/marks', color: '#14b8a6' }
  ];

  // Charts
  performanceLabels = ['Math Test 1', 'Math Test 2', 'Science Test 1', 'Science Test 2'];
  performanceData = [{ data: [75, 80, 68, 85], label: 'Class Average', backgroundColor: '#6366f1' }];

  attendanceLabels = ['Present', 'Absent', 'Leave'];
  attendanceData = [{ data: [92, 5, 3], backgroundColor: ['#10b981', '#ef4444', '#f59e0b'] }];

  testResultsLabels = ['A+', 'A', 'B', 'C', 'D', 'F'];
  testResultsData = [{ data: [5, 12, 18, 8, 3, 1], label: 'Grade Distribution', backgroundColor: '#8b5cf6' }];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.teacherName = user?.name || user?.username || 'Teacher';

    if (user && user.id) {
      // Fetch teacher statistics from endpoint
      this.dashboardService.getTeacherStats(user.id).subscribe({
        next: (data: any) => {
          if (data) {
            // Note: If fields returned by API differ slightly, map them correctly or fall back.
            this.statCards[0].value = data.studentCount || 0;
            this.statCards[1].value = (data.avgAttendance || data.attendancePercentage || 0) + '%';
            this.statCards[2].value = data.testsCreated || 0;
            this.statCards[3].value = data.materialsCount || 0;
            this.statCards[4].value = data.classesToday || 0; // Upcoming classes today
            this.statCards[5].value = data.pendingReviews || 0;
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
