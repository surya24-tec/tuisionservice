
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Student } from '../../shared/models/student.model';

type AttendanceStatus = 'Present' | 'Absent';

interface AttendanceRecord {
  studentId: number;
  studentCode: string;
  studentName: string;
  studentClass: string;
  batchName: string;
  status: AttendanceStatus;
}

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  filterClass = '';
  filterBatch = '';

  classes: string[] = [];
  batches: string[] = [];

  isLoading = false;
  isSaving = false;
  students: Student[] = [];
  attendance: AttendanceRecord[] = [];

  get todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  get isToday(): boolean {
    return this.selectedDate === this.todayStr;
  }

  get totalStudents(): number { return this.attendance.length; }
  get presentCount(): number { return this.attendance.filter(a => a.status === 'Present').length; }
  get absentCount(): number { return this.attendance.filter(a => a.status === 'Absent').length; }
  get attendancePercentage(): number {
    return this.totalStudents ? Math.round((this.presentCount / this.totalStudents) * 100) : 0;
  }

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.students = this.readStorage('teacher_students') as Student[];
    this.classes = this.getUniqueValues(this.students.map(student => student.studentClass));
    this.batches = this.getUniqueValues(this.students.map(student => student.batch?.name || ''));

    const filteredStudents = this.students.filter(student => {
      const classMatches = !this.filterClass || student.studentClass === this.filterClass;
      const batchMatches = !this.filterBatch || (student.batch?.name || '') === this.filterBatch;
      return classMatches && batchMatches;
    });

    this.attendance = filteredStudents.map((student, index) => this.mapStudentToAttendance(student, index));
    this.loadSavedAttendance();
    this.isLoading = false;
  }

  onFilterChange(): void {
    this.loadStudents();
  }

  onDateChange(): void {
    this.loadStudents();
  }

  markAll(status: AttendanceStatus): void {
    if (!this.isToday) {
      this.showSnack('You can only edit attendance for today!', 'error');
      return;
    }
    this.attendance.forEach(a => a.status = status);
  }

  setStatus(record: AttendanceRecord, status: AttendanceStatus): void {
    if (!this.isToday) {
      this.showSnack('You can only edit attendance for today!', 'error');
      return;
    }
    record.status = status;
  }

  saveAttendance(): void {
    if (!this.isToday) {
      this.showSnack('You can only save attendance for today!', 'error');
      return;
    }
    this.isSaving = true;
    try {
      const attendanceStore = this.readStorage('teacher_attendance_records');
      const currentKeys = new Set(this.attendance.map(record => this.getRecordKey(record)));
      const nextStore = attendanceStore.filter((entry: any) => {
        return !(entry.date === this.selectedDate && currentKeys.has(this.getStoredRecordKey(entry)));
      });

      this.attendance.forEach(record => {
        nextStore.push({
          date: this.selectedDate,
          studentId: record.studentId,
          studentCode: record.studentCode,
          studentName: record.studentName,
          studentClass: record.studentClass,
          batchName: record.batchName,
          status: record.status
        });
      });

      localStorage.setItem('teacher_attendance_records', JSON.stringify(nextStore));
      this.showSnack('Attendance saved successfully!', 'success');
    } catch {
      this.showSnack('Failed to save attendance', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  private loadSavedAttendance(): void {
    const attendanceStore = this.readStorage('teacher_attendance_records');
    const savedRecords = attendanceStore.filter((entry: any) => entry.date === this.selectedDate);

    if (savedRecords.length === 0) {
      return;
    }

    this.attendance = this.attendance.map(record => {
      const saved = savedRecords.find((entry: any) => this.getStoredRecordKey(entry) === this.getRecordKey(record));
      return saved
        ? { ...record, status: saved.status === 'Present' ? 'Present' : 'Absent' }
        : record;
    });
  }

  private readStorage(key: string): any[] {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private mapStudentToAttendance(student: Student, index: number): AttendanceRecord {
    const fallbackId = index + 1;
    const numericStudentId = Number((student.studentId || '').replace(/\D/g, ''));
    const studentId = typeof student.id === 'number'
      ? student.id
      : Number.isFinite(numericStudentId) && numericStudentId > 0
        ? numericStudentId
        : fallbackId;

    return {
      studentId,
      studentCode: student.studentId || `#${studentId}`,
      studentName: student.name,
      studentClass: student.studentClass,
      batchName: student.batch?.name || 'Not Assigned',
      status: 'Present'
    };
  }

  private getUniqueValues(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
  }

  private getRecordKey(record: AttendanceRecord): string {
    return [
      record.studentId,
      record.studentCode,
      record.studentName.trim().toLowerCase(),
      record.studentClass,
      record.batchName
    ].join('|');
  }

  private getStoredRecordKey(entry: any): string {
    return [
      entry.studentId ?? '',
      entry.studentCode ?? `#${entry.studentId ?? ''}`,
      (entry.studentName || '').trim().toLowerCase(),
      entry.studentClass || '',
      entry.batchName || 'Not Assigned'
    ].join('|');
  }

  private showSnack(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}
