import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../shared/models/teacher.model';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})
export class TeacherFormComponent implements OnInit {
  teacherForm: FormGroup;
  isEditMode: boolean;
  isLoading = false;

  statusOptions = ['Active', 'Inactive', 'On Leave'];

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private dialogRef: MatDialogRef<TeacherFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; teacher?: Teacher }
  ) {
    this.isEditMode = data.isEdit;

    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      teachingSubject: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      salary: [0, [Validators.required, Validators.min(0)]],
      address: [''],
      joiningDate: [new Date(), Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.teacher) {
      // Patch the form with existing data
      this.teacherForm.patchValue({
        ...this.data.teacher,
        joiningDate: new Date(this.data.teacher.joiningDate)
      });
    }
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.teacherForm.value;

    // Format date to string YYYY-MM-DD
    const date = new Date(formValue.joiningDate);
    const formattedDate = date.toISOString().split('T')[0];

    const teacherData: Teacher = {
      ...formValue,
      joiningDate: formattedDate
    };

    if (this.isEditMode && this.data.teacher?.id) {
      this.teacherService.updateTeacher(this.data.teacher.id, teacherData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating teacher:', error);
          // Handle error (could use snackbar, but relying on list component for now)
        }
      });
    } else {
      this.teacherService.createTeacher(teacherData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating teacher:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
