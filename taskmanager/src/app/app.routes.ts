import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { ListComponent } from './features/list/list.component';
import { DownloadComponent } from './features/download/download.component';


export const routes: Routes = [
  // Omdirigera roten till "dashboard"
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home
  { path: 'home', component: HomeComponent },

   // Dashboard
   { path: 'dashboard', component: DashboardComponent },

  // List
  { path: 'list', component: ListComponent },

  // Download
  { path: 'download', component: DownloadComponent },
 
];
