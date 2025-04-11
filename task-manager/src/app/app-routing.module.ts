import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { ProjectFormComponent } from './projects/project-form/project-form.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';

import { TasksComponent } from './tasks/tasks.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';

const routes: Routes = [
  // Start/home-sida
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },

  // Dashboard som standalone
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },

  // Projects
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/new', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },

  // Tasks
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },

  // Wildcard fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
