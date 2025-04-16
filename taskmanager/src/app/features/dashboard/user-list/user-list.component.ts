import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';  // Importera FormsModule här

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // Lägg till FormsModule här
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];  // Lista för filtrerade användare
  searchQuery: string = '';     // För att hålla sökfrågan
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        this.filteredUsers = data;  // Initiera filteredUsers med alla användare
        this.loading = false;
      },
      error => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    );
  }

  // Filtrera användarna baserat på sökfrågan
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
