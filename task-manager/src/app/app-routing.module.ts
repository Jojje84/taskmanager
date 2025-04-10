import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/shared/components/home/home.component'; // Justera sökvägen till HomeComponent
import { DashboardComponent } from '../app/features/dashboard/dashboard.component';
import { TasksComponent } from '../app/features/tasks/tasks.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TasksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
