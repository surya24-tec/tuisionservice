import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

interface Test {
  id?: number;
  title: string;
  subject: string;
  className: string;
  batch?: string;
  date: string;
  maxMarks: number;
  duration: number;
  description: string;
  status: string;
  published?: boolean;
}

interface Student {
  id?: number;
  name: string;
  email: string;
  phone: string;
  className: string;
  batch?: string;
  address: string;
}

@Component({
  selector: 'app-student-tests',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1><mat-icon>quiz</mat-icon> My Tests</h1>
          <p class="subtitle">View and complete your assigned tests</p>
        </div>
      </div>

      <div class="spinner-wrap" *ngIf="isLoading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div class="tests-grid" *ngIf="!isLoading">
        <div class="test-card" *ngFor="let test of tests">
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ test.title }}</mat-card-title>
              <mat-card-subtitle>{{ test.subject }} • {{ test.className }} {{ test.batch ? '• ' + test.batch : '' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="test-details">
                <div class="detail-item">
                  <mat-icon>event</mat-icon>
                  <span>{{ test.date }}</span>
                </div>
                <div class="detail-item">
                  <mat-icon>timer</mat-icon>
                  <span>{{ test.duration }} mins</span>
                </div>
                <div class="detail-item">
                  <mat-icon>grade</mat-icon>
                  <span>Max Marks: {{ test.maxMarks }}</span>
                </div>
              </div>
              <p *ngIf="test.description" class="description">{{ test.description }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button 
                class="btn-primary"
                (click)="openTest(test)"
                [disabled]="test.status !== 'Scheduled'">
                <mat-icon>edit</mat-icon>
                {{ test.status === 'Scheduled' ? 'Start Test' : 'View Test' }}
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div class="empty-state" *ngIf="!isLoading && tests.length === 0">
        <mat-icon>quiz</mat-icon>
        <h3>No Tests Assigned</h3>
        <p>You don't have any tests assigned yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

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

    .subtitle {
      color: #718096;
      font-size: 0.9rem;
      margin: 4px 0 0;
    }

    .spinner-wrap {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .test-card mat-card {
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
    }

    .test-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4a5568;
    }

    .detail-item mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }

    .description {
      color: #718096;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #4299e1, #3182ce);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(66,153,225,0.4);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

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
export class StudentTestsComponent implements OnInit {
  tests: Test[] = [];
  isLoading = false;
  student: Student | null = null;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadStudentAndTests();
  }

  loadStudentAndTests(): void {
    this.isLoading = true;
    const user = this.authService.getUser();

    // Get student details from localStorage
    const rawStudents = localStorage.getItem('teacher_students');
    const students: Student[] = rawStudents ? JSON.parse(rawStudents) : [];
    this.student = students.find(s => s.name === user?.name) || null;

    if (this.student) {
      // Get published tests assigned to student's class/batch
      const rawTests = localStorage.getItem('teacher_tests');
      const allTests: Test[] = rawTests ? JSON.parse(rawTests) : [];
      
      this.tests = allTests.filter(test => 
        test.published && 
        test.className === this.student!.className && 
        (test.batch && test.batch !== '' ? test.batch === this.student!.batch : true)
      );
    }

    this.isLoading = false;
  }

  openTest(test: Test): void {
    this.snackBar.open('Test started! In a real app, this would open a test interface.', 'Close', {
      duration: 3000
    });
  }
}
