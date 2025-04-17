import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { TaskService } from '../../core/services/task.service'; // TaskService
import { ProjectService } from '../../core/services/project.service'; // ProjectService
import { PieChartComponent } from '../../shared/components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UserListComponent, PieChartComponent, BarChartComponent, SummaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedUser: User | null = null;
  userProjects: any[] = [];
  userTasks: any[] = [];
  selectedProjectTasks: any[] = [];  // För att spara tasks för ett valt projekt

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  // Hantera när en användare väljs
  onUserSelected(user: User): void {
    this.selectedUser = user;
    this.loadUserProjects(user.id);
  }

  // Ladda projekt för en användare
  loadUserProjects(userId: number): void {
    this.projectService.getProjectsByUser(userId).subscribe((projects) => {
      this.userProjects = projects;
    });
  }

  // Hantera när ett projekt klickas för att visa relaterade tasks
  onProjectClick(projectId: number): void {
    this.taskService.getTasksByProjectId(projectId).subscribe((tasks) => {
      this.selectedProjectTasks = tasks;
    });
  }

  // Få statistik för projekten
  getProjectStatsFor() {
    return this.userProjects.map((project) => {
      const taskCount = this.selectedProjectTasks.filter(
        (task) => task.projectId === project.id
      ).length;
      return {
        name: project.name,
        taskCount: taskCount,
      };
    });
  }
}
