import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

interface Test {
  id?: number;
  title: string;
  subject: string;
  className: string;
  batch?: string;
  date: string;
  maxMarks: number;
  duration: number;
  description: string;
  status: string;
  published?: boolean;
}

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
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatCardModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  isLoading = true;
  studentName = '';
  student: Student | null = null;
  statCards: StatCard[] = [];
  recentTests: Test[] = [];
  recentMarks: MarkEntry[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.studentName = user?.name || user?.username || 'Student';

    // Load student data from localStorage
    const rawStudents = localStorage.getItem('teacher_students');
    const students: Student[] = rawStudents ? JSON.parse(rawStudents) : [];
    this.student = students.find(s => s.name === this.studentName) || null;

    // Load stats
    this.loadStats();

    this.isLoading = false;
  }

  loadStats(): void {
    const rawTests = localStorage.getItem('teacher_tests');
    const allTests: Test[] = rawTests ? JSON.parse(rawTests) : [];
    const rawMarks = localStorage.getItem('teacher_marks');
    const allMarks: MarkEntry[] = rawMarks ? JSON.parse(rawMarks) : [];
    const rawMaterials = localStorage.getItem('teacher_materials');
    const allMaterials: any[] = rawMaterials ? JSON.parse(rawMaterials) : [];

    // Filter for current student
    this.recentMarks = allMarks
      .filter(m => m.studentName === this.studentName)
      .slice(0, 3);

    let studentTests: Test[] = [];
    if (this.student) {
      studentTests = allTests.filter(t => 
        t.published && 
        t.className === this.student!.className && 
        (!t.batch || t.batch === '' || t.batch === this.student!.batch)
      );
    }
    this.recentTests = studentTests.slice(0, 3);

    const totalMarks = this.recentMarks.reduce((sum, m) => sum + m.marksObtained, 0);
    const upcomingTests = this.recentTests.filter(t => t.status === 'Scheduled').length;
    const materialsCount = allMaterials.length;

    this.statCards = [
      { title: 'Total Marks', value: totalMarks, icon: 'grade', color: '#10b981' },
      { title: 'Upcoming Tests', value: upcomingTests, icon: 'quiz', color: '#8b5cf6' },
      { title: 'Recent Grades', value: this.recentMarks.length, icon: 'assessment', color: '#3b82f6' },
      { title: 'Study Materials', value: materialsCount, icon: 'auto_stories', color: '#f59e0b' }
    ];
  }
}
