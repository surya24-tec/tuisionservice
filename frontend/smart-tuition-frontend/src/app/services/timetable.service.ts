import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimetableEvent } from '../shared/models/timetable.model';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  
  // Dummy data for now.
  getTodaySchedule(userId: number, role: string): Observable<TimetableEvent[]> {
    return of([
      { id: 1, time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Sharma', room: '101' },
      { id: 2, time: '10:30 AM', subject: 'Physics', teacher: 'Mrs. Patel', room: '102' },
      { id: 3, time: '12:00 PM', subject: 'Chemistry', teacher: 'Dr. Kumar', room: '103' },
      { id: 4, time: '02:00 PM', subject: 'English', teacher: 'Ms. Priya', room: '104' },
    ]);
  }
}
