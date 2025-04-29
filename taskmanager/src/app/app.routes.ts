import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  // Omdirigera roten till "dashboard"
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Home
  { path: 'home', component: HomeComponent },

  // List
 
];
