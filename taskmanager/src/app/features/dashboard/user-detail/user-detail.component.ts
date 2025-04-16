import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  projects: Project[] = [];
  tasks: Task[] = [];

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
        this.projects = projects.filter(p => p.userId === user.id);

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
}
