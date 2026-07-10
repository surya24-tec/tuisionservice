import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      // Placeholder routes for future modules
      { path: 'teachers', component: AdminDashboardComponent },
      { path: 'students', component: AdminDashboardComponent },
      { path: 'courses', component: AdminDashboardComponent },
      { path: 'batches', component: AdminDashboardComponent },
      { path: 'fees', component: AdminDashboardComponent },
      { path: 'attendance', component: AdminDashboardComponent },
      { path: 'reports', component: AdminDashboardComponent },
      { path: 'notifications', component: AdminDashboardComponent },
      { path: 'settings', component: AdminDashboardComponent },
      { path: 'profile', component: AdminDashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModule {}
