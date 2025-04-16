import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ExportTasksComponent, ExportProjectsComponent],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  projects: Project[] = [];
  tasks: Task[] = [];
  expandedProjectId: number | null = null;

  searchQuery: string = ''; // Updated to a regular string

  filteredProjects = (): Project[] => {
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;

      this.projectService.getProjects().subscribe(projects => {
        this.projects = projects.filter(p => Number(p.userId) === Number(user.id));

        const projectIds = this.projects.map(p => p.id);

        this.taskService.getTasks().subscribe(tasks => {
          this.tasks = tasks.filter(t => projectIds.includes(t.projectId));
        });
      });
    });
  }

  getTasksForProject(projectId: number): Task[] {
    return this.tasks.filter(t => t.projectId === projectId);
  }

  getCompletedTasks(projectId: number): Task[] {
    return this.tasks.filter(t => t.projectId === projectId && t.status === 'completed');
  }

  getProgressPercent(projectId: number): number {
    const total = this.getTasksForProject(projectId).length;
    const done = this.getCompletedTasks(projectId).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  toggleProject(projectId: number) {
    this.expandedProjectId = this.expandedProjectId === projectId ? null : projectId;
  }
}
