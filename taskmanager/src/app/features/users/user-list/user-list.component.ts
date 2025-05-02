import { Component, OnInit, Output, EventEmitter, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatDialogModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Output() userSelected = new EventEmitter<User>();

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  tasks: Task[] = [];
  projects: Project[] = [];

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      },
    });

    this.projectService.fetchProjects().subscribe();

    this.taskService.fetchTasks().subscribe(); // viktig för signal

    effect(() => {
      this.tasks = this.taskService.allTasks(); // reaktiv bindning
    });
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
      panelClass: 'useredit-dialog-container', // Lägg till en CSS-klass
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
      panelClass: 'newuser-dialog-container', // Lägg till en CSS-klass
      data: {}, // Skicka data om det behövs
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.refreshUsers();
      }
    });
  }

  refreshUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
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
          });
        }
      });
  }

  getProjectCount(user: User): number {
    return this.projectService.allProjects().filter((p) => p.userId === user.id)
      .length;
  }

  getTaskCount(user: User): number {
    return this.taskService
      .allTasks()
      .filter((t) => t.userId === user.id && t.status.toLowerCase() !== 'completed')
      .length;
  }

  getTaskPercentage(user: User, priority: string): number {
    const userTasks = this.taskService
      .allTasks()
      .filter((t) => t.userId === user.id && t.status.toLowerCase() !== 'completed');
    const total = userTasks.length;

    if (total === 0) return 0; // Returnera 0 om det inte finns några uppgifter

    return (
      (userTasks.filter(
        (t) => t.priority.toLowerCase() === priority.toLowerCase()
      ).length /
        total) *
      100
    );
  }
}
