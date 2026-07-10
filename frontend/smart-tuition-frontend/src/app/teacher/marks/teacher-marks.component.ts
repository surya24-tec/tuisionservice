import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface MarkEntry {
  studentId: number;
  studentName: string;
  testTitle: string;
  subject: string;
  className: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  examDate: string;
}

@Component({
  selector: 'app-teacher-marks',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule, MatSnackBarModule
  ],
  templateUrl: './teacher-marks.component.html'
})
export class TeacherMarksComponent implements OnInit {
  displayedColumns = ['studentName', 'testTitle', 'subject', 'className', 'marksObtained', 'grade', 'examDate'];
  dataSource = new MatTableDataSource<MarkEntry>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  filterSubject = '';
  filterClass = '';
  searchQuery = '';
  showForm = false;

  newMark: MarkEntry = {
    studentId: 0,
    studentName: '',
    testTitle: '',
    subject: '',
    className: '',
    marksObtained: 0,
    maxMarks: 100,
    grade: '',
    examDate: new Date().toISOString().split('T')[0]
  };

  subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Computer'];
  classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.loadMarks(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMarks(): void {
    this.isLoading = true;
    const raw = localStorage.getItem('teacher_marks');
    this.dataSource.data = raw ? JSON.parse(raw) : [];
    this.isLoading = false;
  }

  applyFilter(): void {
    this.dataSource.filterPredicate = (data: MarkEntry, filter: string) => {
      const f = JSON.parse(filter);
      return (
        (!f.search || data.studentName.toLowerCase().includes(f.search.toLowerCase())) &&
        (!f.subject || data.subject === f.subject) &&
        (!f.className || data.className === f.className)
      );
    };
    this.dataSource.filter = JSON.stringify({
      search: this.searchQuery,
      subject: this.filterSubject,
      className: this.filterClass
    });
  }

  getGradeClass(grade: string): string {
    const m: Record<string, string> = {
      'A+': 'grade-aplus', 'A': 'grade-a', 'B': 'grade-b',
      'C': 'grade-c', 'D': 'grade-d', 'F': 'grade-f'
    };
    return m[grade] || '';
  }

  exportCSV(): void {
    const rows = [
      ['Student', 'Test', 'Subject', 'Class', 'Marks', 'Grade', 'Date'],
      ...this.dataSource.data.map(m => [
        m.studentName, m.testTitle, m.subject, m.className,
        `${m.marksObtained}/${m.maxMarks}`, m.grade, m.examDate
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'marks.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  openForm(): void {
    this.showForm = true;
    this.newMark = {
      studentId: 0,
      studentName: '',
      testTitle: '',
      subject: '',
      className: '',
      marksObtained: 0,
      maxMarks: 100,
      grade: '',
      examDate: new Date().toISOString().split('T')[0]
    };
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveMark(): void {
    if (!this.newMark.studentName || !this.newMark.testTitle || !this.newMark.subject || !this.newMark.className) {
      this.snackBar.open('Please complete all required mark fields.', 'Close', { duration: 3000 });
      return;
    }

    const percentage = this.newMark.maxMarks > 0
      ? (this.newMark.marksObtained / this.newMark.maxMarks) * 100
      : 0;

    const mark: MarkEntry = {
      ...this.newMark,
      studentId: this.newMark.studentId || Date.now(),
      grade: this.resolveGrade(percentage)
    };

    const nextMarks = [mark, ...this.dataSource.data];
    localStorage.setItem('teacher_marks', JSON.stringify(nextMarks));
    this.dataSource.data = nextMarks;
    this.closeForm();
    this.snackBar.open('Marks saved successfully.', 'Close', { duration: 3000 });
  }

  private resolveGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }
}
