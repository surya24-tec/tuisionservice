
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: any = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/dashboard/admin').subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    });
  }
}
