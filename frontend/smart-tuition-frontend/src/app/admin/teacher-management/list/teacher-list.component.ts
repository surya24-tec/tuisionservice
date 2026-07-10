import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../shared/models/teacher.model';
import { TeacherFormComponent } from '../form/teacher-form.component';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'teachingSubject', 'experience', 'salary', 'status', 'actions'];
  teachers: Teacher[] = [];
  totalItems = 0;
  isLoading = false;

  // Pagination & Sorting state
  pageIndex = 0;
  pageSize = 10;
  sortBy = 'id';
  sortDir = 'asc';

  // Filters
  searchSubject: string = '';
  searchExperience: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.teacherService.getTeachers(
      this.pageIndex,
      this.pageSize,
      this.sortBy,
      this.sortDir,
      this.searchSubject || undefined,
      this.searchExperience ?? undefined
    ).subscribe({
      next: (response) => {
        this.teachers = response.teachers;
        this.totalItems = response.totalItems;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading teachers', 'Close', { duration: 3000 });
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTeachers();
  }

  onSortChange(event: any): void {
    this.sortBy = event.active;
    this.sortDir = event.direction || 'asc';
    this.pageIndex = 0;
    this.loadTeachers();
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.loadTeachers();
  }

  clearFilter(): void {
    this.searchSubject = '';
    this.searchExperience = null;
    this.pageIndex = 0;
    this.loadTeachers();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TeacherFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Teacher added successfully', 'Close', { duration: 3000 });
        this.loadTeachers();
      }
    });
  }

  openEditDialog(teacher: Teacher): void {
    const dialogRef = this.dialog.open(TeacherFormComponent, {
      width: '600px',
      data: { isEdit: true, teacher: { ...teacher } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Teacher updated successfully', 'Close', { duration: 3000 });
        this.loadTeachers();
      }
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.deleteTeacher(id).subscribe({
        next: () => {
          this.snackBar.open('Teacher deleted successfully', 'Close', { duration: 3000 });
          this.loadTeachers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting teacher', 'Close', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }
}
