import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentService } from '../../services/student.service';
import { Student } from '../../shared/models/student.model';

interface AttendanceRecord {
  studentId: number;
  studentName: string;
  studentClass: string;
  status: 'Present' | 'Absent' | 'Leave';
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

  classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  batches = ['Morning', 'Afternoon', 'Evening', 'Weekend'];

  isLoading = false;
  isSaving = false;
  students: Student[] = [];
  attendance: AttendanceRecord[] = [];

  get presentCount(): number { return this.attendance.filter(a => a.status === 'Present').length; }
  get absentCount(): number { return this.attendance.filter(a => a.status === 'Absent').length; }
  get leaveCount(): number { return this.attendance.filter(a => a.status === 'Leave').length; }

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.studentService.getStudents(0, 100, 'name', 'asc', '', this.filterClass).subscribe({
      next: (response: any) => {
        const list: Student[] = response?.content ?? response?.students ?? (Array.isArray(response) ? response : []);
        this.students = list;
        this.attendance = list.map(s => ({
          studentId: s.id!,
          studentName: s.name,
          studentClass: s.studentClass,
          status: 'Present'
        }));
        this.loadSavedAttendance();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onFilterChange(): void {
    this.loadStudents();
  }

  markAll(status: 'Present' | 'Absent' | 'Leave'): void {
    this.attendance.forEach(a => a.status = status);
  }

  setStatus(record: AttendanceRecord, status: 'Present' | 'Absent' | 'Leave'): void {
    record.status = status;
  }

  saveAttendance(): void {
    this.isSaving = true;
    const attendanceStore = this.readStorage('teacher_attendance_records');
    const nextStore = attendanceStore.filter((entry: any) => entry.date !== this.selectedDate);

    this.attendance.forEach(record => {
      nextStore.push({
        date: this.selectedDate,
        studentId: record.studentId,
        studentName: record.studentName,
        studentClass: record.studentClass,
        status: record.status
      });
    });

    localStorage.setItem('teacher_attendance_records', JSON.stringify(nextStore));
    this.isSaving = false;
    this.showSnack('Attendance saved successfully!', 'success');
  }

  private loadSavedAttendance(): void {
    const attendanceStore = this.readStorage('teacher_attendance_records');
    const savedRecords = attendanceStore.filter((entry: any) => entry.date === this.selectedDate);

    if (savedRecords.length === 0) {
      return;
    }

    this.attendance = this.attendance.map(record => {
      const saved = savedRecords.find((entry: any) => entry.studentId === record.studentId);
      return saved ? { ...record, status: saved.status } : record;
    });
  }

  private readStorage(key: string): any[] {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }

  private showSnack(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}
