import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardCardsComponent } from '../../shared/widgets/dashboard-cards/dashboard-cards.component';
import { ChartsComponent } from '../../shared/widgets/charts/charts.component';
import { QuickAccessWidgetComponent, QuickAction } from '../../shared/widgets/quick-access/quick-access.component';
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
  isLoading = false; // Set to false initially
  teacherName = '';

  statCards: StatCard[] = [
    { title: 'Total Students', value: 0, icon: 'school', color: '#6366f1' },
    { title: 'Attendance %', value: '0%', icon: 'fact_check', color: '#10b981' },
    { title: 'Total Tests', value: 0, icon: 'quiz', color: '#f59e0b' },
    { title: 'Study Materials', value: 0, icon: 'auto_stories', color: '#8b5cf6' },
    { title: 'Upcoming Classes', value: 3, icon: 'event', color: '#14b8a6' },
    { title: 'Pending Evaluations', value: 2, icon: 'rate_review', color: '#ef4444' },
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.teacherName = user?.name || user?.username || 'Teacher';

    // Load stats from localStorage
    const rawStudents = localStorage.getItem('teacher_students');
    const rawTests = localStorage.getItem('teacher_tests');
    const rawMaterials = localStorage.getItem('teacher_materials');
    const rawMarks = localStorage.getItem('teacher_marks');

    if (rawStudents) {
      this.statCards[0].value = JSON.parse(rawStudents).length;
    }
    if (rawTests) {
      this.statCards[2].value = JSON.parse(rawTests).length;
    }
    if (rawMaterials) {
      this.statCards[3].value = JSON.parse(rawMaterials).length;
    }
    if (rawMarks) {
      this.statCards[5].value = JSON.parse(rawMarks).length;
    }
  }
}
