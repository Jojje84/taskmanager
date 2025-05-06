import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { PieChartComponent } from '../../shared/components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { UserListComponent } from '../users/user-list/user-list.component';
import { ProjectListComponent } from '../projects/project-list/project-list.component';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskService } from '../../core/services/task.service';
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

  constructor(private taskService: TaskService) {}

  onUserSelected(user: User): void {
    this.selectedUser = user;
    this.selectedProjectId = null;
    this.selectedProjectTasks = [];
  }

  onProjectClick(projectId: number): void {
    this.selectedProjectId = projectId;

    // Hämta tasks och använd signalen direkt
    this.taskService.fetchTasks(); // Uppdaterar signalen i TaskService

    const allTasks = this.taskService['tasks'](); // Använd signalen
    this.selectedProjectTasks = allTasks.filter((t: Task) => {
      return (
        t.projectId === projectId &&
        t.userIds?.includes(this.selectedUser?.id || 0)
      );
    });
  }
}
