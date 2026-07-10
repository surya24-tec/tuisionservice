import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-marks',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Marks</h2>
      <div *ngIf="marks.length; else empty">
        <div *ngFor="let mark of marks">
          {{ mark.testTitle }} - {{ mark.subject }} - {{ mark.marksObtained }}/{{ mark.maxMarks }} ({{ mark.grade }})
        </div>
      </div>
      <ng-template #empty>No marks uploaded yet.</ng-template>
    </mat-card>
  `
})
export class StudentMarksComponent implements OnInit {
  marks: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    const raw = localStorage.getItem('teacher_marks');
    const marks = raw ? JSON.parse(raw) : [];
    this.marks = marks.filter((mark: any) => mark.studentName === user?.name);
  }
}
