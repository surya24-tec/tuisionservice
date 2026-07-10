import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../services/student.service';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatTooltipModule, MatProgressSpinnerModule, MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './teacher-students.component.html',
  styleUrls: ['./teacher-students.component.css']
})
export class TeacherStudentsComponent implements OnInit {
  displayedColumns = ['studentId', 'name', 'studentClass', 'batch', 'parentName', 'parentMobileNumber', 'status', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  showForm = false;
  isEditing = false;
  selectedStudent: Student | null = null;

  searchQuery = '';
  filterClass = '';
  filterBatch = '';

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  batches = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
  statuses = ['Active', 'Inactive', 'Transferred'];

  form!: FormGroup;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm(student?: Student): void {
    this.form = this.fb.group({
      name: [student?.name || '', [Validators.required, Validators.minLength(2)]],
      studentClass: [student?.studentClass || '', Validators.required],
      parentName: [student?.parentName || '', Validators.required],
      parentMobileNumber: [student?.parentMobileNumber || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [student?.email || '', [Validators.required, Validators.email]],
      address: [student?.address || '', Validators.required],
      batchName: [student?.batch?.name || ''],
      admissionDate: [student?.admissionDate || new Date().toISOString().split('T')[0], Validators.required],
      status: [student?.status || 'Active', Validators.required],
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    this.studentService.getStudents(
      this.currentPage, this.pageSize, 'name', 'asc',
      this.searchQuery, this.filterClass
    ).subscribe({
      next: (response: any) => {
        const students: Student[] = response?.content ?? response?.students ?? (Array.isArray(response) ? response : []);
        const filteredStudents = this.filterBatch
          ? students.filter(student => (student.batch?.name || '').toLowerCase().includes(this.filterBatch.toLowerCase()))
          : students;

        this.dataSource.data = filteredStudents;
        this.totalElements = response?.totalElements ?? response?.totalItems ?? filteredStudents.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showSnack('Failed to load students', 'error');
      }
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedStudent = null;
    this.initForm();
    this.showForm = true;
  }

  openEditForm(student: Student): void {
    this.isEditing = true;
    this.selectedStudent = student;
    this.initForm(student);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    const payload: Student = {
      name: formValue.name,
      studentClass: formValue.studentClass,
      parentName: formValue.parentName,
      parentMobileNumber: formValue.parentMobileNumber,
      email: formValue.email,
      address: formValue.address,
      batch: null,
      admissionDate: formValue.admissionDate,
      status: formValue.status
    };

    if (this.isEditing && this.selectedStudent?.id) {
      this.studentService.updateStudent(this.selectedStudent.id, payload).subscribe({
        next: () => {
          this.showSnack('Student updated successfully!', 'success');
          this.closeForm();
          this.loadStudents();
        },
        error: () => this.showSnack('Failed to update student', 'error')
      });
    } else {
      this.studentService.createStudent(payload).subscribe({
        next: () => {
          this.showSnack('Student created successfully!', 'success');
          this.closeForm();
          this.loadStudents();
        },
        error: () => this.showSnack('Failed to create student', 'error')
      });
    }
  }

  confirmDelete(student: Student): void {
    if (!confirm(`Delete student "${student.name}"? This cannot be undone.`)) return;
    if (!student.id) return;

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.showSnack('Student deleted successfully!', 'success');
        this.loadStudents();
      },
      error: () => this.showSnack('Failed to delete student', 'error')
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadStudents();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadStudents();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterClass = '';
    this.filterBatch = '';
    this.loadStudents();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'Transferred': 'status-transferred'
    };
    return map[status] || '';
  }

  private showSnack(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}
