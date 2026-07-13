import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1><mat-icon>notifications</mat-icon> Notifications</h1>
          <p class="subtitle">Stay updated with your course announcements</p>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="notifications-list" *ngIf="notifications.length > 0; else emptyState">
        <div class="notification-card" *ngFor="let notif of notifications">
          <div class="notification-icon">
            <mat-icon [style.color]="notif.color || '#3b82f6'">{{ notif.icon || 'notifications' }}</mat-icon>
          </div>
          <div class="notification-content">
            <h4 class="notification-title">{{ notif.title }}</h4>
            <p class="notification-date">{{ notif.date }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon>notifications_none</mat-icon>
          <h3>No Notifications</h3>
          <p>You don't have any notifications yet.</p>
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

    /* ===== NOTIFICATIONS LIST ===== */
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .notification-card {
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

    .notification-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .notification-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(66,153,225,0.1), rgba(49,130,206,0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notification-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 4px 0;
    }

    .notification-date {
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
export class StudentNotificationsComponent implements OnInit {
  notifications: Array<{ title: string; date: string; icon?: string; color?: string }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // TODO: In the future, load notifications from localStorage or backend
    this.notifications = [
      { 
        title: 'New test scheduled', 
        date: new Date().toDateString(), 
        icon: 'quiz', 
        color: '#8b5cf6' 
      },
      { 
        title: 'Assignment deadline approaching', 
        date: new Date().toDateString(), 
        icon: 'assignment', 
        color: '#f59e0b' 
      }
    ];
  }
}
