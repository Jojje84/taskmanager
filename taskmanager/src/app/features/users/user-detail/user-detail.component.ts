import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { ExportTasksComponent } from '../../../shared/components/export-tasks/export-tasks.component';
import { ExportProjectsComponent } from '../../../shared/components/export-projects/export-projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExportTasksComponent,
    ExportProjectsComponent,
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @Output() userUpdated = new EventEmitter<User>();

  userForm!: FormGroup;
  user!: User;
  projects: Project[] = [];
  tasks: Task[] = [];
  expandedProjectId: number | null = null;

  searchQuery: string = ''; // Updated to a regular string

  selectedUser: any;
  userProjects: any[] = [];
  selectedProjectTasks: Task[] = [];

  private projectMap: Map<number, string> = new Map();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, // Ta emot endast id
    private dialogRef: MatDialogRef<UserDetailComponent>
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.data.id).subscribe((user) => {
      this.user = user;
      console.log('User:', this.user);

      this.userForm = this.fb.group({
        name: [user.name],
        role: [user.role],
     
      });

      this.projectService.getProjectsByUserId(user.id).subscribe((projects) => {
        this.projects = projects;
        console.log('Projects:', this.projects);

        this.taskService.getTasksByUserId(user.id).subscribe((tasks) => {
          this.tasks = tasks.map((task) => {
            const project = this.projects.find(
              (p) => Number(p.id) === task.projectId
            );
            return {
              ...task,
              projectName: project ? project.name : 'Unknown',
            };
          });
          console.log('Tasks:', this.tasks);
        });
      });
    });
  }

  getTasksForProject(projectId: number): Task[] {
    return this.tasks.filter((task) => task.projectId === projectId);
  }

  getCompletedTasks(projectId: number): Task[] {
    return this.tasks.filter(
      (task) => task.projectId === projectId && task.status === 'completed'
    );
  }

  toggleProject(projectId: number) {
    this.expandedProjectId =
      this.expandedProjectId === projectId ? null : projectId;
  }

  close(): void {
    this.dialogRef.close(this.user); // Skicka tillbaka den uppdaterade användaren
  }
  onUserSelected(user: any): void {
    this.selectedUser = user;
    console.log('Selected user:', this.selectedUser);

    this.projectService.getProjectsByUserId(user.id).subscribe((projects) => {
      console.log('Projects for selected user:', projects);
      this.userProjects = projects;
    });

    this.selectedProjectTasks = [];
  }
  get filteredProjects(): Project[] {
    return this.projects.filter((project) =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find(
      (project) => project.id === Number(projectId)
    );
    return project ? project.name : 'Unknown';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe((updatedData) => {
        // Uppdatera användarens data lokalt
        this.user = updatedData;

        // Emittera händelsen för att meddela föräldern
        this.userUpdated.emit(updatedData);

        console.log('User updated successfully!', updatedData);
      });
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'normal':
        return 'priority-normal';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }
}
