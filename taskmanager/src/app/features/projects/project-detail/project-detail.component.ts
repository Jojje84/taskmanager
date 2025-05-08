import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  project?: Project;
  tasks: Task[] = [];
  projectForm!: FormGroup;
  users: User[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project },
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDetailComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const projectId = this.data.project.id;

    // Kontrollera om id finns innan vi gör GET-begäran
    if (!projectId) {
      console.error('Project ID is missing!');
      return; // Avsluta om id saknas
    }

    this.projectService
      .getProjectById(projectId)
      .subscribe((project: Project) => {
        this.project = project;
        console.log('Project:', this.project);

        // Initiera formuläret med projektdata
        this.projectForm = this.fb.group({
          name: [project.name],
          description: [project.description],
          userIds: [project.userIds || []],
        });

        // Hämta användare
        this.userService.getUsers().subscribe((users: User[]) => {
          this.users = users;
        });

        // Hämta uppgifter kopplade till projektet
        this.taskService
          .getTasksForProject(this.project.id)
          .subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          });
      });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      // Uppdatera projektets userIds med endast de användare som valts i formuläret
      const updatedProject = {
        ...this.project,
        ...formValue,
        userIds: formValue.userIds, // Använd endast de användare som skickas från formuläret
      };

      // Uppdatera projektet via ProjectService
      this.projectService.updateProject(updatedProject).subscribe(() => {
        // Skicka tillbaka det uppdaterade projektet till listan
        this.dialogRef.close(updatedProject);

        // Visa en snackbar med bekräftelse
        this.snackBar.open('Project updated successfully!', 'Close', {
          duration: 3000,
        });

        // Hämta projekten igen för att säkerställa att signalen är uppdaterad
        this.projectService.fetchProjects();
      });
    }
  }
}
