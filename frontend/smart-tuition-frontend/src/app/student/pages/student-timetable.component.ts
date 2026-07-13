import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-timetable',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1><mat-icon>schedule</mat-icon> Timetable</h1>
          <p class="subtitle">View your class schedule</p>
        </div>
      </div>

      <!-- Timetable Grid -->
      <div class="timetable-grid" *ngIf="timetable.length > 0; else emptyState">
        <div class="timetable-card" *ngFor="let entry of timetable">
          <div class="timetable-icon">
            <mat-icon>book</mat-icon>
          </div>
          <div class="timetable-content">
            <h3 class="timetable-subject">{{ entry.subject }}</h3>
            <p class="timetable-day">{{ entry.day }}</p>
            <p class="timetable-time">{{ entry.time }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon>schedule_send</mat-icon>
          <h3>No Timetable Yet</h3>
          <p>Your teacher hasn't set up your timetable yet.</p>
        </div>
      </ng-template>
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

    /* ===== TIMETABLE GRID ===== */
    .timetable-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .timetable-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .timetable-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .timetable-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(66,153,225,0.1), rgba(49,130,206,0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .timetable-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #3182ce;
    }

    .timetable-content {
      flex: 1;
    }

    .timetable-subject {
      font-size: 18px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 6px 0;
    }

    .timetable-day {
      font-size: 14px;
      color: #4a5568;
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .timetable-time {
      font-size: 14px;
      color: #718096;
      margin: 0;
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
  `]
})
export class StudentTimetableComponent implements OnInit {
  timetable: Array<{ day: string; subject: string; time: string }> = [];

  ngOnInit(): void {
    this.timetable = [
      { day: 'Monday', subject: 'Mathematics', time: '09:00 AM' },
      { day: 'Monday', subject: 'Science', time: '10:00 AM' },
      { day: 'Tuesday', subject: 'English', time: '09:00 AM' }
    ];
  }
}
