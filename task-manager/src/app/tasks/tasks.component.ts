import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../core/services/task.service';
import { ListCardComponent } from '../shared/components/list-card/list-card.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule, ListCardComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: any[] = []; // Lista för att lagra uppgifter

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data; // Tilldela API-svaret till tasks
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }
}
