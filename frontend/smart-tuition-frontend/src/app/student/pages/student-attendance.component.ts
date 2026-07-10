import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Attendance</h2>
      <div *ngIf="records.length; else empty">
        <div *ngFor="let record of records">{{ record.date }} - {{ record.status }}</div>
      </div>
      <ng-template #empty>No attendance records available.</ng-template>
    </mat-card>
  `
})
export class StudentAttendanceComponent implements OnInit {
  records: Array<{ date: string; status: string }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getUser()?.id;
    const raw = localStorage.getItem('teacher_attendance_records');
    const records = raw ? JSON.parse(raw) : [];
    this.records = records
      .filter((record: any) => record.studentId === userId || record.studentName === this.authService.getUser()?.name)
      .map((record: any) => ({ date: record.date, status: record.status }));
  }
}
