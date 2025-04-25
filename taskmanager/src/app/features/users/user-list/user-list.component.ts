import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importera Router här
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailComponent } from '../user-detail/user-detail.component'; // Importera UserDetailComponent här
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'; // Importera ConfirmDialogComponent här

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatDialogModule], // Lägg till RouterModule här om du inte redan har det
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

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {} // Lägg till Router i konstruktorn

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    );
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
    this.userSelected.emit(user); // Sända vidare till förälder om du vill
  }

  // Programmatisk navigering till UserDetailComponent
  goToUserDetail(userId: number): void {
    this.router.navigate(['/user', userId]); // Navigera till /user/:id
  }
  openUserDetailDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      width: '80vw',
      height: '80vh',
      data: { id: user.id }, // Skicka användardata till dialogen
    });

    dialogRef.componentInstance.userUpdated.subscribe((updatedUser: User) => {
      // Uppdatera användarlistan med den uppdaterade användaren
      const index = this.users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.filteredUsers[index] = updatedUser;
      }
    });
  }

  openUserFormDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '80vw',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Kontrollera om en ny användare har lagts till och
      // hämta listan med användare på nytt.
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
        console.log('Bekräftelsevärde:', confirmed, 'för user', user);
        if (confirmed) {
          // Om id:t är en "bummer", tvinga det till ett nummer
          const idToDelete = Number(user.id);
          this.userService.deleteUser(idToDelete).subscribe(
            () => {
              this.users = this.users.filter(
                (u) => Number(u.id) !== idToDelete
              );
              this.filteredUsers = this.filteredUsers.filter(
                (u) => Number(u.id) !== idToDelete
              );
              console.log('Användare raderad');
            },
            (error) => console.error('Delete error:', error)
          );
        }
      });
  }
}
