import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';

// Komponent för att visa lista över användare, projekt och uppgifter
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
  expandedUserId: number | null = null;
  expandedProjectId: number | null = null; // Håller reda på vilket projekt som är expanderat

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {
    // Effekt som körs när users, projects eller tasks ändras och uppdaterar filtrerade listor
    effect(() => {
      const users = this.users();
      const projects = this.projects();
      const tasksRaw = this.taskService['tasks']();

      const enriched = tasksRaw.map((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        const user = users.find((u) => u.id === task.creatorId);
        return {
          ...task,
          projectName: project ? project.name : 'Unknown',
          userName: user ? user.name : 'Unknown',
        };
      });

      this.tasks.set(enriched);

      const selectedUserId = this.selectedUser();
      if (selectedUserId === null) {
        this.selectedUserProjects.set(projects);
        this.selectedUserTasks.set(enriched);
      } else {
        const filteredProjects = projects.filter(
          (project) =>
            project.userIds && project.userIds.includes(selectedUserId)
        );
        const userProjectIds = filteredProjects.map((p) => p.id);
        const filteredTasks = enriched.filter(
          (task) =>
            task.creatorId === selectedUserId ||
            userProjectIds.includes(task.projectId)
        );
        this.selectedUserProjects.set(filteredProjects);
        this.selectedUserTasks.set(filteredTasks);
      }
    });
  }

  // Initierar och hämtar data vid komponentstart
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => this.users.set(data));
    this.projectService
      .getProjects()
      .subscribe((data) => this.projects.set(data));
    this.taskService.fetchTasks();
  }

  // Uppdaterar filtrerade projekt och tasks när användare ändras
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

  // Getter och setter för vald användare i dropdown
  get selectedUserModel() {
    return this.selectedUser();
  }

  set selectedUserModel(value: number | null) {
    this.selectedUser.set(value);
    this.onUserChange();
  }

  // Hämtar användarnamn baserat på id
  getUserName(userId: number | null): string {
    if (userId === null) return 'Unknown';
    const user = this.users().find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  }

  // Returnerar typ av projekt (Shared/Eget)
  getProjectType(projectId: number): string {
    const project = this.projects().find((p) => p.id === projectId);
    return project && project.userIds && project.userIds.length > 1
      ? 'Shared'
      : 'Own';
  }
  toggleUserData(userId: number): void {
    // Om samma användare klickas igen, stäng sektionen och visa "All Users"
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;
      this.selectedUserModel = null; // Återställ till "All Users"
      this.onUserChange(); // Uppdatera projekt och uppgifter
    } else {
      this.expandedUserId = userId;
      this.selectedUserModel = userId; // Uppdatera den valda användaren
      this.onUserChange(); // Uppdatera projekt och uppgifter
    }
  }

  toggleProjectDetails(projectId: number): void {
    if (this.expandedProjectId === projectId) {
      this.expandedProjectId = null; // Stäng om samma projekt klickas igen
    } else {
      this.expandedProjectId = projectId; // Expandera det valda projektet
    }
  }

  // Hämtar tasks för ett specifikt projekt
  getTasksForProject(projectId: number): any[] {
    return this.tasks().filter((task) => task.projectId === projectId);
  }

  getProjectSummary(projectId: number) {
    const tasks = this.getTasksForProject(projectId);
    const active = tasks.filter(
      (t) => t.status?.toLowerCase() === 'active'
    ).length;
    const completed = tasks.filter(
      (t) => t.status?.toLowerCase() === 'completed'
    ).length;
    const high = tasks.filter(
      (t) => t.priority?.toLowerCase() === 'high'
    ).length;
    return { active, completed, high };
  }
}
