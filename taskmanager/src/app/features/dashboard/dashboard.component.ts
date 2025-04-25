import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs'; // Importera BehaviorSubject
import { User } from '../../models/user.model';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { PieChartComponent } from '../../shared/components/pie-chart/pie-chart.component'; // Importera PieChartComponent
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { UserListComponent } from '../user/user-list/user-list.component';
import { ProjectListComponent } from '../projects/project-list/project-list.component';
import { TaskListComponent } from '../tasks/task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    PieChartComponent,
    BarChartComponent,
    SummaryComponent,
    ProjectListComponent, // Lägg till detta
    TaskListComponent, // Lägg till detta
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedUser: User | null = null;
  userProjects: any[] = []; // Kontrollera att detta är korrekt initialiserat
  selectedProjectTasks: any[] = []; // Lägg till rätt typ baserat på din data

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

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
    console.log('Project clicked:', projectId);

    this.taskService.getTasksForProject(projectId).subscribe((tasks) => {
      console.log('Tasks for selected project:', tasks);
      this.selectedProjectTasks = tasks;
    });
  }
}
