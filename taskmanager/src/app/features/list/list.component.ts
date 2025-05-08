import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ListComponent implements OnInit {
  users = signal<any[]>([]);
  projects = signal<any[]>([]);
  tasks = signal<any[]>([]);
  selectedUser = signal<number | null>(null);
  selectedUserProjects = signal<any[]>([]);
  selectedUserTasks = signal<any[]>([]);

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => this.users.set(data));
    this.projectService
      .getProjects()
      .subscribe((data) => this.projects.set(data));

    // Hämta tasks och använd signalen direkt
    this.taskService.fetchTasks(); // Uppdaterar signalen i TaskService

    const enriched = this.taskService['tasks']().map((task) => {
      const project = this.projects().find((p) => p.id === task.projectId);
      const user = this.users().find((u) => u.id === task.creatorId); // Använd creatorId istället för userIds
      return {
        ...task,
        projectName: project ? project.name : 'Unknown',
        userName: user ? user.name : 'Unknown',
      };
    });

    this.tasks.set(enriched);
    this.selectedUserTasks.set(enriched);
    this.selectedUserProjects.set(this.projects());
  }

  onUserChange(): void {
    const selectedUserId = this.selectedUser();
    if (selectedUserId === null) {
      this.selectedUserProjects.set(this.projects());
      this.selectedUserTasks.set(this.tasks());
    } else {
      const filteredProjects = this.projects().filter(
        (project) => project.userId === selectedUserId
      );
      const filteredTasks = this.tasks().filter((task) => {
        const project = this.projects().find((p) => p.id === task.projectId);
        return (
          task.userId === selectedUserId && project?.userId === selectedUserId
        );
      });
      this.selectedUserProjects.set(filteredProjects);
      this.selectedUserTasks.set(filteredTasks);
    }
  }

  get selectedUserModel() {
    return this.selectedUser();
  }

  set selectedUserModel(value: number | null) {
    this.selectedUser.set(value);
    this.onUserChange();
  }

  getUserName(userId: number | null): string {
    if (userId === null) return 'Unknown';
    const user = this.users().find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  }
}
