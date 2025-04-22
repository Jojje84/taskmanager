import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { ExportTasksComponent } from '../../../shared/components/export-tasks/export-tasks.component';
import { ExportProjectsComponent } from '../../../shared/components/export-projects/export-projects.component';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ExportTasksComponent,
    ExportProjectsComponent,
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user?: User;
  projects: Project[] = [];
  tasks: Task[] = [];
  expandedProjectId: number | null = null;

  searchQuery: string = ''; // Updated to a regular string

  filteredProjects = (): Project[] => {
    return this.projects.filter((project) =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  };

  selectedUser: any;
  userProjects: any[] = [];
  selectedProjectTasks: Task[] = [];

  private projectMap: Map<number, string> = new Map();

  constructor(
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

  getProgressPercent(projectId: number): number {
    const total = this.getTasksForProject(projectId).length;
    const done = this.getCompletedTasks(projectId).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  toggleProject(projectId: number) {
    this.expandedProjectId =
      this.expandedProjectId === projectId ? null : projectId;
  }

  close(): void {
    this.dialogRef.close();
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

  onProjectClick(projectId: number): void {
    this.selectedProjectTasks = this.tasks.filter(
      (task) => task.projectId === projectId
    );
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find(
      (project) => project.id === Number(projectId)
    );
    return project ? project.name : 'Unknown';
  }
}
