import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importera Router här
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../user-list/EditUserComponent'; // Importera EditUserComponent här


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // Lägg till RouterModule här om du inte redan har det
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Output() userSelected = new EventEmitter<User>();

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog) {} // Lägg till Router i konstruktorn

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    );
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectUser(user: User): void {
    this.userSelected.emit(user); // Sända vidare till förälder om du vill

  }



  // Programmatisk navigering till UserDetailComponent
  goToUserDetail(userId: number): void {
    this.router.navigate(['/user', userId]);  // Navigera till /user/:id
  }
  openEditUserDialog(user: any): void {
    this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user, // Skicka användardata till dialogen
    });
  }
}


