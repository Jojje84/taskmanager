import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  completedTasksCount: number = 0;
  incompleteTasksCount: number = 0; // Ny variabel för ofullständiga uppgifter

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((response: any) => {
      this.tasks = response.todos; // Anpassa efter API-svar
      console.log('Fetched tasks:', this.tasks); // Logga de hämtade uppgifterna
      this.updateStats(); // Uppdatera statistiken
    });
  }

  // Lägg till en ny uppgift
  addTask(title: string) {
    if (title.trim()) {
      const newTask = { todo: title, completed: false, userId: 1 }; // Anpassa efter API
      this.taskService.addTask(newTask).subscribe((task: any) => {
        this.tasks.push(task); // Lägg till den nya uppgiften i listan
        console.log('Task added:', task); // Logga den nya uppgiften
        this.updateStats(); // Uppdatera statistiken
      });
    }
  }

  // Uppdatera statistiken
  private updateStats() {
    this.completedTasksCount = this.tasks.filter(
      (task: any) => task.completed
    ).length;
    this.incompleteTasksCount = this.tasks.filter(
      (task: any) => !task.completed
    ).length; // Räkna ofullständiga uppgifter
    console.log('Updated stats:', {
      completed: this.completedTasksCount,
      incomplete: this.incompleteTasksCount,
    }); // Logga statistiken
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(
      (response) => {
        console.log('API response:', response); // Logga API-svaret
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        console.log('Task marked as deleted:', taskId);
        this.updateStats(); // Uppdatera statistiken
      },
      (error) => {
        console.error('Failed to mark task as deleted:', error); // Logga eventuella fel
      }
    );
  }
}
