import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../shared/models/notification.model';

@Component({
  selector: 'app-teacher-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './teacher-notifications.component.html',
  styleUrls: ['./teacher-notifications.component.css']
})
export class TeacherNotificationsComponent implements OnInit {
  notifications: AppNotification[] = [];
  isLoading = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void { this.loadNotifications(); }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications('teacher').subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  markRead(n: AppNotification): void {
    n.isRead = true;
    this.notificationService.markAsRead(n.id).subscribe();
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeIcon(type: string): string {
    const m: Record<string, string> = {
      info: 'info', warning: 'warning', success: 'check_circle', error: 'error'
    };
    return m[type] || 'notifications';
  }
}
