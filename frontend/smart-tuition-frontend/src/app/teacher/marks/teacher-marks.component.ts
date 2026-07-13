import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface MarkEntry {
  id?: number;
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
    CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatTooltipModule, MatSnackBarModule
  ],
  templateUrl: './teacher-marks.component.html',
  styleUrls: ['./teacher-marks.component.css']
})
export class TeacherMarksComponent implements OnInit {
  displayedColumns = ['studentName', 'testTitle', 'subject', 'className', 'marksObtained', 'grade', 'examDate', 'actions'];
  dataSource = new MatTableDataSource<MarkEntry>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  marks: MarkEntry[] = [];
  isLoading = false;
  showForm = false;
  isEditing = false;
  selectedMark: MarkEntry | null = null;
  form!: FormGroup;
  searchQuery = '';
  filterSubject = '';
  filterClass = '';

  subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Computer'];
  classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMarks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm(mark?: MarkEntry): void {
    this.form = this.fb.group({
      studentName: [mark?.studentName || '', Validators.required],
      testTitle: [mark?.testTitle || '', Validators.required],
      subject: [mark?.subject || '', Validators.required],
      className: [mark?.className || '', Validators.required],
      marksObtained: [mark?.marksObtained || 0, [Validators.required, Validators.min(0)]],
      maxMarks: [mark?.maxMarks || 100, [Validators.required, Validators.min(1)]],
      examDate: [mark?.examDate || new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  loadMarks(): void {
    this.isLoading = true;
    const raw = localStorage.getItem('teacher_marks');
    this.marks = raw ? JSON.parse(raw) : [];
    this.applyFilters();
    this.isLoading = false;
  }

  applyFilters(): void {
    let filtered = [...this.marks];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.studentName.toLowerCase().includes(q) || 
        m.testTitle.toLowerCase().includes(q)
      );
    }

    if (this.filterSubject) {
      filtered = filtered.filter(m => m.subject === this.filterSubject);
    }

    if (this.filterClass) {
      filtered = filtered.filter(m => m.className === this.filterClass);
    }

    this.dataSource.data = filtered;
  }

  getGradeClass(grade: string): string {
    const map: Record<string, string> = {
      'A+': 'grade-aplus',
      'A': 'grade-a',
      'B': 'grade-b',
      'C': 'grade-c',
      'D': 'grade-d',
      'F': 'grade-f'
    };
    return map[grade] || 'grade-f';
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedMark = null;
    this.initForm();
    this.showForm = true;
  }

  openEditForm(mark: MarkEntry): void {
    this.isEditing = true;
    this.selectedMark = mark;
    this.initForm(mark);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.form.reset();
  }

  saveMark(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    const percentage = (val.marksObtained / val.maxMarks) * 100;
    const grade = this.resolveGrade(percentage);

    const mark: MarkEntry = {
      id: this.isEditing ? this.selectedMark!.id : Date.now(),
      ...val,
      studentId: this.isEditing ? this.selectedMark!.studentId : Date.now(),
      grade: grade
    };

    if (this.isEditing && this.selectedMark?.id) {
      const index = this.marks.findIndex(m => m.id === this.selectedMark!.id);
      if (index !== -1) {
        this.marks[index] = mark;
      }
      this.showSnack('Marks updated!', 'success');
    } else {
      this.marks.unshift(mark);
      this.showSnack('Marks added!', 'success');
    }

    localStorage.setItem('teacher_marks', JSON.stringify(this.marks));
    this.closeForm();
    this.loadMarks();
  }

  deleteMark(mark: MarkEntry): void {
    if (!confirm('Delete this mark entry?')) return;
    this.marks = this.marks.filter(m => m.id !== mark.id);
    localStorage.setItem('teacher_marks', JSON.stringify(this.marks));
    this.showSnack('Marks deleted!', 'success');
    this.loadMarks();
  }

  private resolveGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  exportCSV(): void {
    const rows = [
      ['Student', 'Test', 'Subject', 'Class', 'Marks Obtained', 'Max Marks', 'Grade', 'Date'],
      ...this.dataSource.data.map(m => [
        m.studentName, m.testTitle, m.subject, m.className,
        m.marksObtained, m.maxMarks, m.grade, m.examDate
      ])
    ];

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'marks-report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showSnack('Marks exported!', 'success');
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterSubject = '';
    this.filterClass = '';
    this.applyFilters();
  }

  private showSnack(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}
