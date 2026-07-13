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
  displayedColumns = ['sNo', 'name', 'studentClass', 'batch', 'parentName', 'parentMobileNumber', 'status', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  showForm = false;
  isEditing = false;
  selectedStudent: Student | null = null;
  hidePassword = true;

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
  allStudents: Student[] = [];

  constructor(
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
      password: [student?.password || '', this.isEditing ? '' : Validators.required],
      address: [student?.address || '', Validators.required],
      batchName: [student?.batch?.name || ''],
      admissionDate: [student?.admissionDate || new Date().toISOString().split('T')[0], Validators.required],
      status: [student?.status || 'Active', Validators.required],
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    // Load from localStorage instead of backend API
    const raw = localStorage.getItem('teacher_students');
    this.allStudents = raw ? JSON.parse(raw) : [];
    
    // Apply filters
    let filteredStudents = [...this.allStudents];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    }
    
    if (this.filterClass) {
      filteredStudents = filteredStudents.filter(student => 
        student.studentClass === this.filterClass
      );
    }
    
    if (this.filterBatch) {
      filteredStudents = filteredStudents.filter(student => 
        (student.batch?.name || '').toLowerCase().includes(this.filterBatch.toLowerCase())
      );
    }

    this.totalElements = filteredStudents.length;
    
    // Apply pagination and add sNo
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const paginatedStudents = filteredStudents.slice(start, end);
    
    // Add sNo property to each student in paginated array
    this.dataSource.data = paginatedStudents.map((student, index) => ({
      ...student,
      sNo: start + index + 1
    }));
    
    this.isLoading = false;
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
    
    const student: Student = {
      id: this.isEditing ? this.selectedStudent!.id : Date.now(),
      studentId: this.isEditing ? this.selectedStudent!.studentId : `#${Date.now().toString().slice(-4)}`,
      name: formValue.name,
      studentClass: formValue.studentClass,
      parentName: formValue.parentName,
      parentMobileNumber: formValue.parentMobileNumber,
      email: formValue.email,
      password: formValue.password,
      address: formValue.address,
      batch: formValue.batchName ? { name: formValue.batchName } : null,
      admissionDate: formValue.admissionDate,
      status: formValue.status
    };

    if (this.isEditing && this.selectedStudent?.id) {
      // Update existing student
      const index = this.allStudents.findIndex(s => s.id === this.selectedStudent!.id);
      if (index !== -1) {
        this.allStudents[index] = student;
      }
      this.showSnack('Student updated successfully!', 'success');
    } else {
      // Add new student
      this.allStudents.unshift(student);
      this.showSnack('Student created successfully!', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('teacher_students', JSON.stringify(this.allStudents));
    
    this.closeForm();
    this.loadStudents();
  }

  confirmDelete(student: Student): void {
    if (!confirm(`Delete student "${student.name}"? This cannot be undone.`)) return;
    if (!student.id) return;

    // Delete from array
    this.allStudents = this.allStudents.filter(s => s.id !== student.id);
    
    // Save to localStorage
    localStorage.setItem('teacher_students', JSON.stringify(this.allStudents));
    
    this.showSnack('Student deleted successfully!', 'success');
    this.loadStudents();
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
