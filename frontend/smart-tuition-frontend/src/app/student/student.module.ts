import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLayoutComponent } from './student-layout/student-layout.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'attendance', component: StudentDashboardComponent },
      { path: 'marks', component: StudentDashboardComponent },
      { path: 'fees', component: StudentDashboardComponent },
      { path: 'materials', component: StudentDashboardComponent },
      { path: 'timetable', component: StudentDashboardComponent },
      { path: 'notifications', component: StudentDashboardComponent },
      { path: 'profile', component: StudentDashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentModule {}
