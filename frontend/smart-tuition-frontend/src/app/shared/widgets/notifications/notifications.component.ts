import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppNotification } from '../../models/notification.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notifications-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsWidgetComponent implements OnInit {
  @Input() role: string = 'STUDENT';
  notifications: AppNotification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotifications(this.role).subscribe((data: AppNotification[]) => {
      this.notifications = data;
    });
  }
}
