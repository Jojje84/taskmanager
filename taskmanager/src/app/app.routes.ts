import { Routes } from '@angular/router';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectFormComponent } from './features/projects/project-form/project-form.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { TaskFormComponent } from './features/tasks/task-form/task-form.component';
import { UserListComponent } from './features/dashboard/user-list/user-list.component';
import { UserDetailComponent } from './features/dashboard/user-detail/user-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },

  // Projekt
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/create', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },

  // Uppgifter
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/create/:projectId', component: TaskFormComponent },

  // Användare / Dashboard
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent }
];
