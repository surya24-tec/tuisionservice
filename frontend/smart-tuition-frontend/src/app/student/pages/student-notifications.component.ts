import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Notifications</h2>
      <div *ngIf="notifications.length; else empty">
        <div *ngFor="let notif of notifications">
          {{ notif.title }} - {{ notif.date }}
        </div>
      </div>
      <ng-template #empty>No notifications available.</ng-template>
    </mat-card>
  `
})
export class StudentNotificationsComponent implements OnInit {
  notifications: Array<{ title: string; date: string }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.notifications = [
      { title: 'New test scheduled', date: new Date().toDateString() },
      { title: 'Assignment deadline approaching', date: new Date().toDateString() }
    ];
  }
}
