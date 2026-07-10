import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardCardsComponent } from '../../shared/widgets/dashboard-cards/dashboard-cards.component';
import { ChartsComponent } from '../../shared/widgets/charts/charts.component';
import { DashboardService } from '../../services/dashboard.service';
import { StatCard } from '../../shared/models/dashboard-stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, DashboardCardsComponent, ChartsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  isLoading = true;

  statCards: StatCard[] = [
    { title: 'Total Students', value: 0, icon: 'school', color: '#6366f1', trend: '+12%', trendUp: true },
    { title: 'Total Teachers', value: 0, icon: 'person_outline', color: '#10b981', trend: '+3%', trendUp: true },
    { title: 'Total Courses', value: 0, icon: 'menu_book', color: '#f59e0b', trend: '+5%', trendUp: true },
    { title: 'Total Batches', value: 0, icon: 'groups', color: '#8b5cf6', trend: '+2%', trendUp: true },
    { title: 'Fees Collected', value: '₹0', icon: 'account_balance_wallet', color: '#14b8a6', trend: '+18%', trendUp: true },
    { title: 'Pending Fees', value: '₹0', icon: 'pending_actions', color: '#ef4444', trend: '-5%', trendUp: false },
    { title: 'Attendance %', value: '0%', icon: 'fact_check', color: '#3b82f6', trend: '+2%', trendUp: true },
  ];

  // Chart Data Configurations
  studentCountLabels = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  studentCountData = [{ data: [45, 58, 62, 48, 52], label: 'Students', backgroundColor: '#6366f1' }];

  feeCollectionLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  feeCollectionData = [{ data: [120000, 150000, 180000, 160000, 210000, 250000], label: 'Fee Collection (₹)', borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }];

  attendanceLabels = ['Present', 'Absent', 'On Leave'];
  attendanceData = [{ data: [88, 8, 4], backgroundColor: ['#10b981', '#ef4444', '#f59e0b'] }];

  performanceLabels = ['Math', 'Science', 'English', 'Social Science', 'Computer'];
  performanceData = [
    { data: [78, 82, 85, 80, 88], label: 'Class Average', backgroundColor: '#8b5cf6' },
    { data: [85, 90, 88, 85, 95], label: 'Highest Score', backgroundColor: '#14b8a6' }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAdminStats().subscribe({
      next: (data) => {
        if (data) {
          this.statCards[0].value = data.totalStudents || 0;
          this.statCards[1].value = data.totalTeachers || 0;
          this.statCards[2].value = data.totalCourses || 0;
          this.statCards[3].value = data.totalBatches || 0;
          this.statCards[4].value = '₹' + (data.totalFeesCollected || 0).toLocaleString();
          this.statCards[5].value = '₹' + (data.pendingFees || 0).toLocaleString();
          this.statCards[6].value = (data.attendancePercentage || 0) + '%';
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
