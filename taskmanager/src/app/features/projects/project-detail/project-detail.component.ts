import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Lägg till ReactiveFormsModule här
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  project?: Project;
  tasks: Task[] = [];
  projectForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project },
    private taskService: TaskService,
    private projectService: ProjectService,
    private fb: FormBuilder // Lägg till FormBuilder här
  ) {}

  ngOnInit(): void {
    this.projectService
      .getProjectById(this.data.project.id)
      .subscribe((project: Project) => {
        this.project = project;
        console.log('Project:', this.project);

        // Initiera formuläret med projektdata
        this.projectForm = this.fb.group({
          name: [project.name],
          description: [project.description],
          userId: [project.userIds],
        });

        // Hämta uppgifter kopplade till projektet
        this.taskService
          .getTasksForProject(this.project.id)
          .subscribe((tasks: Task[]) => {});
      });
  }
  onSubmit(): void {
    if (this.projectForm.valid) {
      const updatedProject = { ...this.project, ...this.projectForm.value };
      this.projectService.updateProject(updatedProject); // Uppdaterar signalen i ProjectService

      // Uppdatera projektets data lokalt
      this.project = updatedProject;

      // Logga uppdateringen
      console.log('Project updated successfully!', updatedProject);
    }
  }
}
