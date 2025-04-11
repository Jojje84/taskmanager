import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { ProjectFormComponent } from './projects/project-form/project-form.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { TasksComponent } from './tasks/tasks.component'; // 🆕 Lägg till denna import

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/new', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'tasks', component: TasksComponent }, // 🆕 Lägg till denna route
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
