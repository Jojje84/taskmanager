import { Routes } from '@angular/router';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectFormComponent } from './features/projects/project-form/project-form.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { TaskFormComponent } from './features/tasks/task-form/task-form.component';
import { DashboardComponent } from './features/dashboard/dashboard.component'; // 👈 NY

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: 'user/:id',
    loadComponent: () =>
      import('./features/dashboard/user-detail/user-detail.component').then(
        (m) => m.UserDetailComponent
      ),
  },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent }, // 👈 NY

  // Projekt
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/create', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },

  // Uppgifter
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/create/:projectId', component: TaskFormComponent },
  { path: 'tasks/edit/:id', component: TaskFormComponent },
];
