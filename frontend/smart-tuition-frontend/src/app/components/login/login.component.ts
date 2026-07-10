
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          
          if (response.roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else if (response.roles.includes('ROLE_TEACHER')) {
            this.router.navigate(['/teacher/dashboard']);
          } else if (response.roles.includes('ROLE_STUDENT')) {
            this.router.navigate(['/student/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 });
          console.error('Login error:', error);
        }
      });
    }
  }
}
