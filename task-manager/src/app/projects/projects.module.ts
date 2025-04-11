import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDetailComponent,
    ProjectDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProjectDetailComponent,
    ReactiveFormsModule
  ]
})
export class ProjectsModule { }
