import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1><mat-icon>event_available</mat-icon> Attendance</h1>
          <p class="subtitle">View your attendance records</p>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div class="spinner-wrap" *ngIf="isLoading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Data Table -->
      <div class="table-card" *ngIf="!isLoading && dataSource.data.length > 0">
        <div class="table-wrap">
          <table mat-table [dataSource]="dataSource" matSort class="attendance-table">
            <!-- S.No -->
            <ng-container matColumnDef="sNo">
              <th mat-header-cell *matHeaderCellDef>S.No</th>
              <td mat-cell *matCellDef="let element">
                <span class="sno-badge">{{ element.sNo }}</span>
              </td>
            </ng-container>

            <!-- Date -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let element">{{ element.date }}</td>
            </ng-container>

            <!-- Status -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let element">
                <span class="status-chip" [ngClass]="getStatusClass(element.status)">{{ element.status }}</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
          </table>
        </div>

        <mat-paginator [length]="totalElements" [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 50]"
          showFirstLastButtons></mat-paginator>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && dataSource.data.length === 0">
        <mat-icon>event_busy</mat-icon>
        <h3>No Attendance Records</h3>
        <p>You don't have any attendance records yet.</p>
      </div>
    </div>
  `,
  styles: [`
    /* ===== PAGE CONTAINER ===== */
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ===== HEADER ===== */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-left {
      display: flex;
      flex-direction: column;
    }

    .header-left h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin: 0;
    }

    .header-left h1 mat-icon {
      font-size: 2rem;
      color: #4299e1;
    }

    .subtitle {
      color: #718096;
      font-size: 0.9rem;
      margin: 4px 0 0;
    }

    /* ===== TABLE CARD ===== */
    .table-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
    }

    .table-wrap {
      overflow-x: auto;
    }

    .attendance-table {
      width: 100%;
      background: transparent !important;
    }

    .mat-mdc-header-row {
      background: #f7fafc !important;
    }

    .mat-mdc-header-cell {
      color: #4a5568 !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-bottom: 1px solid #e2e8f0 !important;
    }

    .mat-mdc-cell {
      color: #2d3748 !important;
      font-size: 0.88rem !important;
      border-bottom: 1px solid #f7fafc !important;
    }

    .table-row {
      transition: background 0.15s ease;
    }

    .table-row:hover {
      background: #f7fafc !important;
    }

    /* ===== BADGES ===== */
    .sno-badge {
      background: rgba(66, 153, 225, 0.1);
      color: #3182ce;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .status-chip {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .status-present {
      background: rgba(16,185,129,0.1);
      color: #059669;
    }

    .status-absent {
      background: rgba(239,68,68,0.1);
      color: #dc2626;
    }

    .status-late {
      background: rgba(245,158,11,0.1);
      color: #d97706;
    }

    /* ===== SPINNER ===== */
    .spinner-wrap {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    /* ===== EMPTY STATE ===== */
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #718096;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #cbd5e0;
      display: block;
      margin: 0 auto 16px;
    }

    .empty-state h3 {
      color: #4a5568;
      font-size: 1.2rem;
      margin-bottom: 8px;
    }

    /* ===== PAGINATOR ===== */
    ::ng-deep .mat-mdc-paginator {
      background: transparent !important;
      color: #4a5568 !important;
      border-top: 1px solid #f7fafc;
    }

    ::ng-deep .mat-mdc-paginator .mat-mdc-icon-button {
      color: #4a5568 !important;
    }
  `]
})
export class StudentAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['sNo', 'date', 'status'];
  dataSource = new MatTableDataSource<any>();
  totalElements = 0;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.isLoading = true;
    const userId = this.authService.getUser()?.id;
    const raw = localStorage.getItem('teacher_attendance_records');
    let records = raw ? JSON.parse(raw) : [];
    
    // Filter records for current user
    records = records.filter((record: any) => 
      record.studentId === userId || record.studentName === this.authService.getUser()?.name
    );

    // Add serial numbers
    const recordsWithSNo = records.map((record: any, index: number) => ({
      ...record,
      sNo: index + 1
    }));

    this.dataSource.data = recordsWithSNo;
    this.totalElements = recordsWithSNo.length;
    this.isLoading = false;

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('present')) {
      return 'status-present';
    } else if (statusLower.includes('absent')) {
      return 'status-absent';
    } else {
      return 'status-late';
    }
  }
}
