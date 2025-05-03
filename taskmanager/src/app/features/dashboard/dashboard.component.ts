import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model'; // Importera Task-modellen
import { Project } from '../../models/project.model'; // Importera Project-modellen
import { PieChartComponent } from '../../shared/components/pie-chart/pie-chart.component'; // Importera PieChartComponent
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { UserListComponent } from '../users/user-list/user-list.component';
import { ProjectListComponent } from '../projects/project-list/project-list.component';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskService } from '../../core/services/task.service'; // Importera TaskService
import { BarChartByProjectComponent } from '../../shared/components/bar-chart-project/project.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    PieChartComponent,
    BarChartComponent,
    SummaryComponent,
    ProjectListComponent,
    TaskListComponent,
    BarChartByProjectComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedUser: User | null = null;
  selectedProjectId: number | null = null;
  selectedProjectTasks: Task[] = [];
  userProjects: Project[] = [];

  constructor(private taskService: TaskService) {} // Injicera TaskService

  onUserSelected(user: User): void {
    this.selectedUser = user;
    this.selectedProjectId = null; // Återställ valt projekt
    this.selectedProjectTasks = []; // Återställ uppgifter
    console.log('Selected user:', this.selectedUser);
    this.loadUserProjects(user.id); // Ladda projekt för den nya användaren
  }

  onProjectClick(projectId: number): void {
    this.selectedProjectId = projectId;
    console.log('Selected project ID:', this.selectedProjectId);
    this.loadTasksForProject(projectId); // Ladda uppgifter för det valda projektet
  }

  loadTasksForProject(projectId: number): void {
    console.log('Loading tasks for project ID:', projectId);
    this.taskService.getTasksForProject(projectId).subscribe(
      (tasks: Task[]) => {
        this.selectedProjectTasks = tasks;
        console.log('Tasks loaded for project:', tasks);
      },
      (error: any) => {
        console.error('Failed to load tasks for project:', error);
      }
    );
  }

  loadUserProjects(userId: number): void {
    console.log('Loading projects for user ID:', userId);
    // Här kan du anropa en tjänst för att hämta projekten
  }
}
