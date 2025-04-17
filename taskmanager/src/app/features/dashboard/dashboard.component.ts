import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs'; // Importera BehaviorSubject
import { User } from '../../models/user.model';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { PieChartComponent } from '../../shared/components/pie-chart/pie-chart.component'; // Importera PieChartComponent
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    PieChartComponent,
    BarChartComponent,
    SummaryComponent,
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
    console.log('Selected user:', this.selectedUser); // Kontrollera att användaren är vald

    // Hämta projekt för användaren
    this.projectService.getProjectsByUserId(user.id).subscribe((projects) => {
      console.log('Projects for selected user:', projects); // Kontrollera data
      this.userProjects = projects;
    });
  }

  onProjectClick(projectId: number): void {
    console.log('Project clicked:', projectId);

    // Hämta uppgifter för det valda projektet
    this.taskService.getTasksForProject(projectId).subscribe((tasks) => {
      console.log('Tasks for selected project:', tasks); // Kontrollera data
      this.selectedProjectTasks = tasks;
    });
  }
}
