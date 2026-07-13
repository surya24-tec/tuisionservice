import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-materials',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1><mat-icon>folder</mat-icon> Study Materials</h1>
          <p class="subtitle">Access your study materials</p>
        </div>
      </div>

      <!-- Materials Grid -->
      <div class="materials-grid" *ngIf="materials.length > 0; else emptyState">
        <div class="material-card" *ngFor="let material of materials">
          <div class="material-icon">
            <mat-icon>insert_drive_file</mat-icon>
          </div>
          <div class="material-content">
            <h3 class="material-title">{{ material.title }}</h3>
            <p class="material-subject">Subject: {{ material.subject || 'General' }}</p>
          </div>
          <div class="material-actions">
            <a *ngIf="material.fileUrl" [href]="material.fileUrl" target="_blank" class="btn-download">
              <mat-icon>download</mat-icon>
              Download
            </a>
            <span *ngIf="!material.fileUrl" class="no-link">
              <mat-icon>link_off</mat-icon>
              No Link
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon>folder_open</mat-icon>
          <h3>No Materials Yet</h3>
          <p>Your teacher hasn't uploaded any study materials yet.</p>
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

    /* ===== MATERIALS GRID ===== */
    .materials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .material-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .material-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .material-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(66,153,225,0.1), rgba(49,130,206,0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .material-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #3182ce;
    }

    .material-content {
      flex: 1;
      min-width: 0;
    }

    .material-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .material-subject {
      font-size: 14px;
      color: #718096;
      margin: 0;
    }

    .material-actions {
      flex-shrink: 0;
    }

    .btn-download {
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #4299e1, #3182ce);
      color: white;
      padding: 8px 16px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-download:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(66,153,225,0.3);
    }

    .btn-download mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .no-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #a0aec0;
      font-size: 14px;
      font-weight: 500;
    }

    .no-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
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
export class StudentMaterialsComponent implements OnInit {
  materials: any[] = [];

  ngOnInit(): void {
    const raw = localStorage.getItem('teacher_materials');
    this.materials = raw ? JSON.parse(raw) : [];
  }
}
