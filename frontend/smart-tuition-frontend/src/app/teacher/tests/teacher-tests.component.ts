import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Test {
  id?: number;
  title: string;
  subject: string;
  className: string;
  batch?: string;
  date: string;
  maxMarks: number;
  duration: number; // minutes
  description: string;
  status: string; // Scheduled, Completed, Cancelled
  published?: boolean;
}

interface Student {
  id?: number;
  name: string;
  email: string;
  phone: string;
  className: string;
  batch?: string;
  address: string;
}

@Component({
  selector: 'app-teacher-tests',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './teacher-tests.component.html',
  styleUrls: ['./teacher-tests.component.css']
})
export class TeacherTestsComponent implements OnInit {
  displayedColumns = ['title', 'subject', 'className', 'date', 'maxMarks', 'status', 'actions'];
  dataSource = new MatTableDataSource<Test>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tests: Test[] = [];
  isLoading = false;
  showForm = false;
  isEditing = false;
  selectedTest: Test | null = null;

  searchQuery = '';
  filterClass = '';
  filterStatus = '';

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  batches = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
  subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Computer'];
  statuses = ['Scheduled', 'Completed', 'Cancelled'];

  form!: FormGroup;
  allTests: Test[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTests();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm(test?: Test): void {
    this.form = this.fb.group({
      title: [test?.title || '', Validators.required],
      subject: [test?.subject || '', Validators.required],
      className: [test?.className || '', Validators.required],
      batch: [test?.batch || ''],
      date: [test?.date || new Date().toISOString().split('T')[0], Validators.required],
      maxMarks: [test?.maxMarks || 100, [Validators.required, Validators.min(1)]],
      duration: [test?.duration || 60, [Validators.required, Validators.min(1)]],
      description: [test?.description || ''],
      status: [test?.status || 'Scheduled', Validators.required]
    });
  }

  loadTests(): void {
    this.isLoading = true;
    // Load from localStorage instead of backend API
    const raw = localStorage.getItem('teacher_tests');
    this.allTests = raw ? JSON.parse(raw) : [];

    // Apply filters
    let filteredTests = [...this.allTests];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredTests = filteredTests.filter(test =>
        test.title.toLowerCase().includes(query) ||
        test.subject.toLowerCase().includes(query)
      );
    }

    if (this.filterClass) {
      filteredTests = filteredTests.filter(test =>
        test.className === this.filterClass
      );
    }

    if (this.filterStatus) {
      filteredTests = filteredTests.filter(test =>
        test.status === this.filterStatus
      );
    }

    this.totalElements = filteredTests.length;

    // Apply pagination
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = filteredTests.slice(start, end);

    this.isLoading = false;
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedTest = null;
    this.initForm();
    this.showForm = true;
  }

  openEditForm(test: Test): void {
    this.isEditing = true;
    this.selectedTest = test;
    this.initForm(test);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;

    const test: Test = {
      id: this.isEditing ? this.selectedTest!.id : Date.now(),
      title: formValue.title,
      subject: formValue.subject,
      className: formValue.className,
      batch: formValue.batch,
      date: formValue.date,
      maxMarks: formValue.maxMarks,
      duration: formValue.duration,
      description: formValue.description,
      status: formValue.status,
      published: false
    };

    if (this.isEditing && this.selectedTest?.id) {
      // Update existing test
      const index = this.allTests.findIndex(t => t.id === this.selectedTest!.id);
      if (index !== -1) {
        this.allTests[index] = test;
      }
      this.showSnack('Test updated successfully!', 'success');
    } else {
      // Add new test
      this.allTests.unshift(test);
      this.assignTestToStudents(test);
      this.showSnack('Test created and assigned successfully!', 'success');
    }

    // Save to localStorage
    localStorage.setItem('teacher_tests', JSON.stringify(this.allTests));

    this.closeForm();
    this.loadTests();
  }

  assignTestToStudents(test: Test): void {
    // Load existing students and marks
    const rawStudents = localStorage.getItem('teacher_students');
    const students: Student[] = rawStudents ? JSON.parse(rawStudents) : [];
    const rawMarks = localStorage.getItem('teacher_marks');
    const marks = rawMarks ? JSON.parse(rawMarks) : [];

    // Find matching students (class + batch)
    const matchingStudents = students.filter(student => 
      student.className === test.className && 
      (test.batch && test.batch !== '' ? student.batch === test.batch : true)
    );

    if (matchingStudents.length === 0) {
      return;
    }

    // Create mark entry for each student
    const newMarks = matchingStudents.map(student => {
      // Generate random marks for demo purposes (simulates automatic scoring)
      // In real app, this would be from actual test answers
      const randomMarks = Math.floor(Math.random() * (test.maxMarks - 20 + 1)) + 20; // Between 20 and maxMarks
      const percentage = (randomMarks / test.maxMarks) * 100;

      return {
        studentId: student.id || Date.now() + Math.random(),
        studentName: student.name,
        testTitle: test.title,
        subject: test.subject,
        className: test.className,
        marksObtained: randomMarks,
        maxMarks: test.maxMarks,
        grade: this.resolveGrade(percentage),
        examDate: test.date
      };
    });

    // Combine and save
    const nextMarks = [...newMarks, ...marks];
    localStorage.setItem('teacher_marks', JSON.stringify(nextMarks));
  }

  private resolveGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  togglePublish(test: Test): void {
    test.published = !test.published;
    const index = this.allTests.findIndex(t => t.id === test.id);
    if (index !== -1) {
      this.allTests[index] = test;
      localStorage.setItem('teacher_tests', JSON.stringify(this.allTests));
      this.showSnack(test.published ? 'Test published!' : 'Test unpublished!', 'success');
      this.loadTests();
    }
  }

  deleteTest(test: Test): void {
    if (!confirm(`Delete test "${test.title}"? This cannot be undone.`)) return;
    if (!test.id) return;

    // Delete from array
    this.allTests = this.allTests.filter(t => t.id !== test.id);

    // Save to localStorage
    localStorage.setItem('teacher_tests', JSON.stringify(this.allTests));

    this.showSnack('Test deleted successfully!', 'success');
    this.loadTests();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': 'status-scheduled',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return map[status] || '';
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadTests();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadTests();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterClass = '';
    this.filterStatus = '';
    this.loadTests();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTests();
  }

  private showSnack(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}
