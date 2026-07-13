import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

interface Student {
  id?: number;
  name: string;
  username?: string;
  email: string;
  phone: string;
  studentClass: string;
  batch?: { name: string } | string;
  parentName: string;
  parentMobileNumber: string;
  address: string;
  admissionDate: string;
  status: string;
}

@Component({
  selector: 'app-student-profile',
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
          <h1><mat-icon>person</mat-icon> My Profile</h1>
          <p class="subtitle">View and manage your profile</p>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="profile-card" *ngIf="student">
        <div class="profile-header">
          <div class="profile-avatar">{{ student.name?.charAt(0) || 'S' }}</div>
          <div class="profile-info">
            <h2 class="profile-name">{{ student.name }}</h2>
            <p class="profile-username">{{ student.username || student.email }}</p>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <div class="detail-icon">
              <mat-icon>email</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Email</p>
              <p class="detail-value">{{ student.email }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <mat-icon>class</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Class</p>
              <p class="detail-value">{{ student.studentClass }}</p>
            </div>
          </div>

          <div class="detail-item" *ngIf="getBatchName(student.batch)">
            <div class="detail-icon">
              <mat-icon>group</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Batch</p>
              <p class="detail-value">{{ getBatchName(student.batch) }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <mat-icon>person</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Parent Name</p>
              <p class="detail-value">{{ student.parentName }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <mat-icon>phone</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Parent Mobile</p>
              <p class="detail-value">{{ student.parentMobileNumber }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Admission Date</p>
              <p class="detail-value">{{ student.admissionDate }}</p>
            </div>
          </div>

          <div class="detail-item" style="grid-column: 1 / -1;">
            <div class="detail-icon">
              <mat-icon>location_on</mat-icon>
            </div>
            <div class="detail-content">
              <p class="detail-label">Address</p>
              <p class="detail-value" style="white-space: normal; line-height: 1.5;">{{ student.address }}</p>
            </div>
          </div>
        </div>
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

    /* ===== PROFILE CARD ===== */
    .profile-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f7fafc;
      margin-bottom: 24px;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4299e1, #3182ce);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-size: 24px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 4px 0;
    }

    .profile-username {
      font-size: 14px;
      color: #718096;
      margin: 0;
    }

    /* ===== PROFILE DETAILS ===== */
    .profile-details {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f7fafc;
      border-radius: 12px;
    }

    .detail-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(66,153,225,0.1), rgba(49,130,206,0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #3182ce;
    }

    .detail-content {
      flex: 1;
      min-width: 0;
    }

    .detail-label {
      font-size: 12px;
      color: #a0aec0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .detail-value {
      font-size: 15px;
      color: #2d3748;
      font-weight: 500;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  student: Student | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadStudentProfile();
  }

  loadStudentProfile(): void {
    const user = this.authService.getUser();
    if (!user) return;

    // Load students from localStorage
    const rawStudents = localStorage.getItem('teacher_students');
    const students: Student[] = rawStudents ? JSON.parse(rawStudents) : [];

    // Find the current student by name
    this.student = students.find((s: Student) => s.name === user.name) || null;

    // If no student found in localStorage, use basic user info
    if (!this.student) {
      this.student = {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: '',
        studentClass: '',
        parentName: '',
        parentMobileNumber: '',
        address: '',
        admissionDate: '',
        status: ''
      };
    }
  }

  getBatchName(batch: any): string {
    if (typeof batch === 'string') {
      return batch;
    } else if (batch && batch.name) {
      return batch.name;
    }
    return '';
  }
}
