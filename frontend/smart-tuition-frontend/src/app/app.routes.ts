import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () => import('./admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' as const },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'teachers', loadComponent: () => import('./admin/teacher-management/list/teacher-list.component').then(m => m.TeacherListComponent) },
      { path: 'students', loadComponent: () => import('./teacher/students/teacher-students.component').then(m => m.TeacherStudentsComponent) },
      { path: 'courses', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'batches', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'fees', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'attendance', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'reports', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'notifications', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'settings', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    ]
  },
  {
    path: 'teacher',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_TEACHER'] },
    loadComponent: () => import('./teacher/teacher-layout/teacher-layout.component').then(m => m.TeacherLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' as const },
      { path: 'dashboard', loadComponent: () => import('./teacher/dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent) },
      { path: 'students', loadComponent: () => import('./teacher/students/teacher-students.component').then(m => m.TeacherStudentsComponent) },
      { path: 'attendance', loadComponent: () => import('./teacher/attendance/teacher-attendance.component').then(m => m.TeacherAttendanceComponent) },
      { path: 'tests', loadComponent: () => import('./teacher/tests/teacher-tests.component').then(m => m.TeacherTestsComponent) },
      { path: 'materials', loadComponent: () => import('./teacher/materials/teacher-materials.component').then(m => m.TeacherMaterialsComponent) },
      { path: 'marks', loadComponent: () => import('./teacher/marks/teacher-marks.component').then(m => m.TeacherMarksComponent) },
      { path: 'performance', loadComponent: () => import('./teacher/marks/teacher-marks.component').then(m => m.TeacherMarksComponent) },
      { path: 'notifications', loadComponent: () => import('./teacher/notifications/teacher-notifications.component').then(m => m.TeacherNotificationsComponent) },
      { path: 'profile', loadComponent: () => import('./teacher/profile/teacher-profile.component').then(m => m.TeacherProfileComponent) },
    ]
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_STUDENT'] },
    loadComponent: () => import('./student/student-layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' as const },
      { path: 'dashboard', loadComponent: () => import('./student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
      { path: 'attendance', loadComponent: () => import('./student/pages/student-attendance.component').then(m => m.StudentAttendanceComponent) },
      { path: 'marks', loadComponent: () => import('./student/pages/student-marks.component').then(m => m.StudentMarksComponent) },
      { path: 'tests', loadComponent: () => import('./student/pages/student-tests.component').then(m => m.StudentTestsComponent) },
      { path: 'materials', loadComponent: () => import('./student/pages/student-materials.component').then(m => m.StudentMaterialsComponent) },
      { path: 'timetable', loadComponent: () => import('./student/pages/student-timetable.component').then(m => m.StudentTimetableComponent) },
      { path: 'notifications', loadComponent: () => import('./student/pages/student-notifications.component').then(m => m.StudentNotificationsComponent) },
      { path: 'profile', loadComponent: () => import('./student/pages/student-profile.component').then(m => m.StudentProfileComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
