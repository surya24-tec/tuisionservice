import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
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
  batch: string;
  date: string;
  maxMarks: number;
  duration: number; // minutes
  description: string;
  status: string;
}

@Component({
  selector: 'app-teacher-tests',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './teacher-tests.component.html',
  styleUrls: ['./teacher-tests.component.css']
})
export class TeacherTestsComponent implements OnInit {
  tests: Test[] = [];
  isLoading = false;
  showForm = false;
  isEditing = false;
  selectedTest: Test | null = null;

  form!: FormGroup;

  classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  batches = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
  subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Computer'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTests();
  }

  initForm(test?: Test): void {
    this.form = this.fb.group({
      title: [test?.title || '', Validators.required],
      subject: [test?.subject || '', Validators.required],
      className: [test?.className || '', Validators.required],
      batch: [test?.batch || '', Validators.required],
      date: [test?.date || '', Validators.required],
      maxMarks: [test?.maxMarks || 100, [Validators.required, Validators.min(1)]],
      duration: [test?.duration || 60, [Validators.required, Validators.min(1)]],
      description: [test?.description || ''],
      status: [test?.status || 'Scheduled']
    });
  }

  loadTests(): void {
    this.isLoading = true;
    const raw = localStorage.getItem('teacher_tests');
    this.tests = raw ? JSON.parse(raw) : [];
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

  closeForm(): void { this.showForm = false; }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data: Test = this.form.value;

    if (this.isEditing && this.selectedTest?.id) {
      this.tests = this.tests.map(test => test.id === this.selectedTest!.id ? { ...data, id: this.selectedTest!.id } : test);
      this.persistTests();
      this.showSnack('Test updated!', 'success');
      this.closeForm();
      this.loadTests();
    } else {
      this.tests = [{ ...data, id: Date.now() }, ...this.tests];
      this.persistTests();
      this.showSnack('Test created!', 'success');
      this.closeForm();
      this.loadTests();
    }
  }

  deleteTest(test: Test): void {
    if (!confirm(`Delete test "${test.title}"?`)) return;
    this.tests = this.tests.filter(item => item.id !== test.id);
    this.persistTests();
    this.showSnack('Test deleted!', 'success');
    this.loadTests();
  }

  getStatusClass(s: string): string {
    const m: Record<string, string> = { Scheduled: 'status-scheduled', Completed: 'status-completed', Cancelled: 'status-cancelled' };
    return m[s] || '';
  }

  private showSnack(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: type === 'success' ? ['snack-success'] : ['snack-error'] });
  }

  private persistTests(): void {
    localStorage.setItem('teacher_tests', JSON.stringify(this.tests));
  }
}
