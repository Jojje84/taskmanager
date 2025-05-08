import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  Output,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @Output() userUpdated = new EventEmitter<User>();

  userForm!: FormGroup;
  user!: User;
  projects: Project[] = [];
  tasks: Task[] = [];
  expandedProjectId: number | null = null;

  searchQuery: string = '';

  selectedUser: any;
  userProjects: Project[] = [];
  selectedProjectTasks: Task[] = [];

  private userSignal: WritableSignal<User | null> = signal(null);

  users: User[] = []; // Fyll denna med alla användare, t.ex. via UserService

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialogRef: MatDialogRef<UserDetailComponent>
  ) {
    effect(() => {
      const user = this.userSignal();
      if (!user) return;

      const allProjects = this.projectService['projects']() ?? [];
      const allTasks = this.taskService['tasks']() ?? [];

      this.projects = allProjects.filter((p: Project) =>
        p.userIds.includes(user.id)
      );

      const userProjectIds = this.projects.map((p) => Number(p.id));
      this.tasks = allTasks
        .filter(
          (task: Task) =>
            task.creatorId === user.id ||
            userProjectIds.includes(Number(task.projectId))
        )
        .map((task: Task) => {
          const project = this.projects.find(
            (p) => Number(p.id) === task.projectId
          );
          return {
            ...task,
            projectName: project ? project.name : 'Unknown',
            formattedDeadline: task.deadline
              ? new Date(task.deadline).toLocaleDateString()
              : 'No deadline',
          };
        });
    });
  }

  ngOnInit(): void {
    this.userService.getUserById(this.data.id).subscribe((user) => {
      this.user = user;
      this.userForm = this.fb.group({
        name: [user.name],
        role: [user.role],
      });
      this.userSignal.set(user);

      this.projectService.fetchProjects();
      this.taskService.fetchTasks?.();

      // Lägg till detta för att fylla users-arrayen!
      this.userService.getUsers().subscribe((users) => {
        this.users = users;
      });
    });
  }

  getTasksForProject(projectId: number): Task[] {
    return this.tasks.filter((task) => task.projectId === projectId);
  }

  getCompletedTasks(projectId: number): Task[] {
    return this.tasks.filter(
      (task) => task.projectId === projectId && task.status === 'completed'
    );
  }

  toggleProject(projectId: number) {
    this.expandedProjectId =
      this.expandedProjectId === projectId ? null : projectId;
  }

  close(): void {
    this.dialogRef.close(this.user); // Skicka tillbaka den uppdaterade användaren
  }
  onUserSelected(user: any): void {
    this.selectedUser = user;
    console.log('Selected user:', this.selectedUser);

    this.projectService.getProjectsByUserId(user.id);

    const projects = this.projectService['projects']();
    this.userProjects = projects.filter((p: Project) =>
      p.userIds.includes(user.id)
    );
    console.log('Projects for selected user:', this.userProjects);

    this.selectedProjectTasks = [];
  }
  get filteredProjects(): Project[] {
    return this.projects.filter((project) =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find(
      (project) => project.id === Number(projectId)
    );
    return project ? project.name : 'Unknown';
  }

  getUserName(id: number): string {
    const user = this.users.find((u) => u.id === id);
    return user ? user.name : id.toString();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe((updatedData) => {
        // Uppdatera användarens data lokalt
        this.user = updatedData;

        // Emittera händelsen för att meddela föräldern
        this.userUpdated.emit(updatedData);

        console.log('User updated successfully!', updatedData);
      });
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  getProjectUserCount(projectId: number): number {
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.userIds.length : 0;
  }
}
