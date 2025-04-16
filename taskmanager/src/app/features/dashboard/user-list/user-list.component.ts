import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;  // För att visa laddningsindikator
  errorMessage: string = ''; // För att hantera eventuella fel

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        this.loading = false;  // Sätt loading till false när datan har hämtats
      },
      error => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;  // Sätt loading till false om det blir ett fel
      }
    );
  }
}
