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
import { Task } from '../../../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { WritableSignal, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';

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
  tasksPerUser: WritableSignal<{ [userId: number]: Task[] }> = signal({}); // Gör tasksPerUser till en signal

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
      },
      error: () => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      },
    });

    this.projectService.fetchProjects(); // Uppdaterar signalen i ProjectService
    this.taskService.fetchTasks(); // Uppdaterar signalen i TaskService

    // Effekt för att säkerställa att tasksPerUser uppdateras i realtid
    effect(() => {
      const tasks = this.tasksPerUser();
      this.filteredUsers = [...this.filteredUsers]; // Tvinga omrendering
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
            const updatedTasks = { ...this.tasksPerUser() };
            delete updatedTasks[idToDelete];
            this.tasksPerUser.set(updatedTasks); // Uppdatera signalen
          });
        }
      });
  }

  getProjectCount(user: User): number {
    const allProjects = this.projectService['projects'](); // Hämta projekten från signalen
    return allProjects.filter((p) => p.userIds?.includes(user.id)).length;
  }

  getTaskCount(user: User): number {
    const allTasks = this.taskService['tasks'](); // Hämta alla tasks från signalen i TaskService
    const allProjects = this.projectService['projects'](); // Hämta alla projekt från signalen i ProjectService

    // Hämta projekt där användaren är associerad
    const userProjectIds = allProjects
      .filter((project) => project.userIds?.includes(user.id))
      .map((project) => project.id);

    // Filtrera tasks baserat på creatorId eller projektId
    return allTasks.filter(
      (task: Task) =>
        task.creatorId === user.id || userProjectIds.includes(task.projectId)
    ).length;
  }

  getTaskPercentage(user: User, priority: string): number {
    const allTasks = this.taskService['tasks']();
    const allProjects = this.projectService['projects']();

    // Hämta projekt där användaren är associerad
    const userProjectIds = allProjects
      .filter((project) => project.userIds?.includes(user.id))
      .map((project) => project.id);

    // Filtrera ENDAST aktiva tasks baserat på creatorId eller projektId
    const userTasks = allTasks.filter(
      (task: Task) =>
        (task.creatorId === user.id ||
          userProjectIds.includes(task.projectId)) &&
        task.status?.toLowerCase() === 'active'
    );

    const total = userTasks.length;
    if (total === 0) {
      return 0;
    }

    // Beräkna procentandelen baserat på prioritet (bland aktiva tasks)
    const priorityTasks = userTasks.filter(
      (t) => t.priority?.toLowerCase() === priority.toLowerCase()
    );

    return (priorityTasks.length / total) * 100;
  }
}
