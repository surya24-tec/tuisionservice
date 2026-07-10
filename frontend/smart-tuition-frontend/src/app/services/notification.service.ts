import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppNotification } from '../shared/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Dummy data for now. Can be replaced with actual HTTP calls.
  getNotifications(role?: string): Observable<AppNotification[]> {
    return of([
      { id: 1, title: 'System Update', message: 'The system will be undergoing maintenance tonight.', date: new Date().toISOString(), type: 'warning', isRead: false },
      { id: 2, title: 'New Course Added', message: 'A new Advanced Physics course has been added.', date: new Date().toISOString(), type: 'info', isRead: false },
      { id: 3, title: 'Fee Reminder', message: 'Please ensure all pending fees are collected by Friday.', date: new Date().toISOString(), type: 'error', isRead: true }
    ]);
  }

  markAsRead(id: number): Observable<void> {
    // Stub – replace with HTTP call when backend is ready
    return of(undefined);
  }
}
