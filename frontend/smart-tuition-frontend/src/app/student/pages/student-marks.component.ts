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
  selector: 'app-student-marks',
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
          <h1><mat-icon>grade</mat-icon> Marks</h1>
          <p class="subtitle">View your test results</p>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div class="spinner-wrap" *ngIf="isLoading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Data Table -->
      <div class="table-card" *ngIf="!isLoading && dataSource.data.length > 0">
        <div class="table-wrap">
          <table mat-table [dataSource]="dataSource" matSort class="marks-table">
            <!-- S.No -->
            <ng-container matColumnDef="sNo">
              <th mat-header-cell *matHeaderCellDef>S.No</th>
              <td mat-cell *matCellDef="let element">
                <span class="sno-badge">{{ element.sNo }}</span>
              </td>
            </ng-container>

            <!-- Test Title -->
            <ng-container matColumnDef="testTitle">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Test</th>
              <td mat-cell *matCellDef="let element">{{ element.testTitle }}</td>
            </ng-container>

            <!-- Subject -->
            <ng-container matColumnDef="subject">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Subject</th>
              <td mat-cell *matCellDef="let element">{{ element.subject }}</td>
            </ng-container>

            <!-- Marks -->
            <ng-container matColumnDef="marks">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Marks</th>
              <td mat-cell *matCellDef="let element">{{ element.marksObtained }} / {{ element.maxMarks }}</td>
            </ng-container>

            <!-- Grade -->
            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Grade</th>
              <td mat-cell *matCellDef="let element">
                <span class="grade-chip" [ngClass]="getGradeClass(element.grade)">{{ element.grade }}</span>
              </td>
            </ng-container>

            <!-- Date -->
            <ng-container matColumnDef="examDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let element">{{ element.examDate }}</td>
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
        <mat-icon>emoji_events</mat-icon>
        <h3>No Marks Yet</h3>
        <p>Your teacher hasn't uploaded any marks yet.</p>
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

    .marks-table {
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

    .grade-chip {
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 700;
    }

    .grade-aplus {
      background: rgba(16,185,129,0.1);
      color: #059669;
    }

    .grade-a {
      background: rgba(34,197,94,0.1);
      color: #16a34a;
    }

    .grade-b {
      background: rgba(234,179,8,0.1);
      color: #ca8a04;
    }

    .grade-c {
      background: rgba(249,115,22,0.1);
      color: #ea580c;
    }

    .grade-d {
      background: rgba(239,68,68,0.1);
      color: #dc2626;
    }

    .grade-f {
      background: rgba(220,38,38,0.1);
      color: #b91c1c;
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
export class StudentMarksComponent implements OnInit {
  displayedColumns: string[] = ['sNo', 'testTitle', 'subject', 'marks', 'grade', 'examDate'];
  dataSource = new MatTableDataSource<any>();
  totalElements = 0;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMarks();
  }

  loadMarks(): void {
    this.isLoading = true;
    const user = this.authService.getUser();
    const raw = localStorage.getItem('teacher_marks');
    let marks = raw ? JSON.parse(raw) : [];

    // Filter marks for current user
    marks = marks.filter((mark: any) => mark.studentName === user?.name);

    // Add serial numbers
    const marksWithSNo = marks.map((mark: any, index: number) => ({
      ...mark,
      sNo: index + 1
    }));

    this.dataSource.data = marksWithSNo;
    this.totalElements = marksWithSNo.length;
    this.isLoading = false;

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getGradeClass(grade: string): string {
    const gradeLower = grade?.toLowerCase() || '';
    if (gradeLower === 'a+') return 'grade-aplus';
    if (gradeLower === 'a') return 'grade-a';
    if (gradeLower === 'b') return 'grade-b';
    if (gradeLower === 'c') return 'grade-c';
    if (gradeLower === 'd') return 'grade-d';
    return 'grade-f';
  }
}
