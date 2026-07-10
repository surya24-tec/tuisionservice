import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-timetable',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Timetable</h2>
      <div *ngIf="timetable.length; else empty">
        <div *ngFor="let entry of timetable">
          {{ entry.day }} - {{ entry.subject }} ({{ entry.time }})
        </div>
      </div>
      <ng-template #empty>No timetable available.</ng-template>
    </mat-card>
  `
})
export class StudentTimetableComponent implements OnInit {
  timetable: Array<{ day: string; subject: string; time: string }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.timetable = [
      { day: 'Monday', subject: 'Mathematics', time: '09:00 AM' },
      { day: 'Monday', subject: 'Science', time: '10:00 AM' },
      { day: 'Tuesday', subject: 'English', time: '09:00 AM' },
    ];
  }
}
