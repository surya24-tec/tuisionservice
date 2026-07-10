export interface AppNotification {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
}
