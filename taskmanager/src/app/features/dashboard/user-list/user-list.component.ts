import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importera Router här
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Lägg till RouterModule här om du inte redan har det
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
  selectedUser: User | null = null; // Håller den valda användaren
  isPopupVisible: boolean = false; // Hanterar popupens synlighet

  constructor(private userService: UserService, private router: Router) {} // Lägg till Router i konstruktorn

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
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectUser(user: User): void {
    this.userSelected.emit(user); // Sända vidare till förälder om du vill
  }

  // Programmatisk navigering till UserDetailComponent
  goToUserDetail(userId: number): void {
    // Hämta användarens detaljer baserat på ID
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.selectedUser = user; // Sätt den valda användaren
      this.isPopupVisible = true; // Visa popupen
    }
  }

  closePopup(): void {
    this.isPopupVisible = false; // Stäng popupen
    this.selectedUser = null; // Rensa vald användare
  }
}
