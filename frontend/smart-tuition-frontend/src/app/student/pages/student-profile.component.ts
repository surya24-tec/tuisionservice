import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Student Profile</h2>
      <div *ngIf="user">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>
    </mat-card>
  `
})
export class StudentProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }
}
