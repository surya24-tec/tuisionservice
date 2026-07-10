import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'students', component: TeacherDashboardComponent },
      { path: 'attendance', component: TeacherDashboardComponent },
      { path: 'tests', component: TeacherDashboardComponent },
      { path: 'materials', component: TeacherDashboardComponent },
      { path: 'marks', component: TeacherDashboardComponent },
      { path: 'notifications', component: TeacherDashboardComponent },
      { path: 'profile', component: TeacherDashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherModule {}
