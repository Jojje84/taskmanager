import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksComponent } from './tasks.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    SharedModule,

    // 👇 importera standalone-komponenterna här
    TasksComponent,
    TaskFormComponent,
    TaskDetailComponent,
    TaskListComponent
  ],
  exports: [
    TaskListComponent // 👈 om den används i t.ex. dashboard
  ]
})
export class TasksModule {}
