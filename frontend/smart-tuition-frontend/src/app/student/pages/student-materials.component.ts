import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-materials',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Study Materials</h2>
      <div *ngIf="materials.length; else empty">
        <div *ngFor="let material of materials">
          <a *ngIf="material.fileUrl" [href]="material.fileUrl" target="_blank">{{ material.title }}</a>
          <span *ngIf="!material.fileUrl">{{ material.title }}</span>
          <span> - {{ material.subject || 'General' }}</span>
        </div>
      </div>
      <ng-template #empty>No materials available.</ng-template>
    </mat-card>
  `
})
export class StudentMaterialsComponent implements OnInit {
  materials: any[] = [];

  ngOnInit(): void {
    const raw = localStorage.getItem('teacher_materials');
    this.materials = raw ? JSON.parse(raw) : [];
  }
}
