import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../../../core/services/task.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatDialogModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  @Output() userSelected = new EventEmitter<User>();

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  projects: Project[] = [];
  tasksPerUser: { [userId: number]: Task[] } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Hämta användare
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;

        this.fetchAllUserTasks();
      },
      error: () => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      },
    });

    // Hämta projekt
    this.projectService.fetchProjects(); // Uppdaterar signalen i ProjectService

    // Lyssna på ändringar i tasks via signalen
    effect(() => {
      const tasks = this.taskService['tasks'](); // Använd signalen
      this.updateTasksPerUser(tasks);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchAllUserTasks(): void {
    this.http.get<Task[]>(`http://localhost:3000/tasks`).subscribe((tasks) => {
      for (const user of this.users) {
        this.tasksPerUser[user.id] = tasks.filter(
          (t) =>
            t.userIds?.includes(user.id) &&
            t.status.toLowerCase() !== 'completed'
        );
      }
    });
  }

  updateTasksPerUser(tasks: Task[]): void {
    for (const user of this.users) {
      this.tasksPerUser[user.id] = tasks.filter(
        (t) =>
          t.userIds?.includes(user.id) && t.status.toLowerCase() !== 'completed'
      );
    }
  }

  filterUsers(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }

  selectUser(user: User): void {
    this.userSelected.emit(user);
  }

  goToUserDetail(userId: number): void {
    this.router.navigate(['/user', userId]);
  }

  openUserDetailDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      panelClass: 'useredit-dialog-container',
      data: { id: user.id },
    });

    dialogRef.componentInstance.userUpdated.subscribe((updatedUser: User) => {
      const index = this.users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.filteredUsers[index] = updatedUser;
      }
    });
  }

  openUserFormDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      panelClass: 'newuser-dialog-container',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.refreshUsers();
        this.fetchAllUserTasks();
      }
    });
  }

  refreshUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
      this.fetchAllUserTasks();
    });
  }

  deleteUser(user: User): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Radera användare',
          content: 'Är du säker på att du vill radera den här användaren?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          const idToDelete = Number(user.id);
          this.userService.deleteUser(idToDelete).subscribe(() => {
            this.users = this.users.filter((u) => Number(u.id) !== idToDelete);
            this.filteredUsers = this.filteredUsers.filter(
              (u) => Number(u.id) !== idToDelete
            );
            delete this.tasksPerUser[idToDelete];
          });
        }
      });
  }

  getProjectCount(user: User): number {
    const allProjects = this.projectService['projects'](); // Använd signalen direkt
    return allProjects.filter((p: Project) => p.userIds.includes(user.id))
      .length;
  }

  getTaskCount(user: User): number {
    return this.tasksPerUser[user.id]?.length || 0;
  }

  getTaskPercentage(user: User, priority: string): number {
    const userTasks = this.tasksPerUser[user.id] || [];
    const total = userTasks.length;
    if (total === 0) return 0;

    return (
      (userTasks.filter(
        (t) => t.priority?.toLowerCase() === priority.toLowerCase()
      ).length /
        total) *
      100
    );
  }
}
