import { Component, OnInit, signal, effect } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { DownloadService } from '../../core/services/download.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { FormsModule } from '@angular/forms'; // Importera FormsModule
import { CommonModule } from '@angular/common'; // Importera CommonModule

@Component({
  selector: 'app-download',
  standalone: true,
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  imports: [FormsModule, CommonModule], // Lägg till FormsModule och CommonModule här
})
export class DownloadComponent implements OnInit {
  users: User[] = [];
  tasks: Task[] = [];
  projects: Project[] = [];
  selectedUserId: number | null = null;
  selectedTaskId: number | null = null;
  selectedProjectId: number | null = null;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private downloadService: DownloadService
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => (this.users = users));
    this.projectService.getProjects().subscribe((projects) => (this.projects = projects));

    // Använd effect för att lyssna på förändringar i tasks
    effect(() => {
      this.tasks = this.taskService.allTasks();
    });
  }

  prepareData() {
    let filteredTasks = this.tasks;

    if (this.selectedUserId) {
      filteredTasks = filteredTasks.filter((task) => task.userId === this.selectedUserId);
    }

    if (this.selectedTaskId) {
      filteredTasks = filteredTasks.filter((task) => task.id === this.selectedTaskId);
    }

    const filteredProjects = this.selectedProjectId
      ? this.projects.filter((project) => project.id === this.selectedProjectId)
      : this.projects;

    return {
      users: this.users,
      tasks: filteredTasks,
      projects: filteredProjects,
    };
  }

  downloadAsExcel() {
    const data = this.prepareData();
    this.downloadService.downloadAsExcel(data);
  }

  downloadAsCSV() {
    const data = this.prepareData();
    this.downloadService.downloadAsCSV(data);
  }

  downloadAsJSON() {
    const data = this.prepareData();
    this.downloadService.downloadAsJSON(data);
  }
}
