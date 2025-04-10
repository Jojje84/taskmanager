import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importera CommonModule här
import { TaskService } from '../../core/services/task.service';  // Importera TaskService
import { Task } from '../../models/task.model';  // Importera Task-modellen

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],  // Lägg till CommonModule här för att använda *ngFor
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];  // Använd Task-modellen för striktare typkontroll

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((response: any) => {
      console.log(response);  // Logga API-svaret för att kontrollera dess struktur
      this.tasks = response.todos;  // Anpassa efter DummyJSON API:s svar
    });
  }

  addTask(title: string) {
    if (title.trim()) {
      const newTask: Task = { 
        todo: title,   // Använd 'todo' istället för 'title' för att matcha API-svaret
        completed: false,
        id: 0  // Låt API:t generera id
      };
      this.taskService.addTask(newTask).subscribe((task: Task) => {
        this.tasks.push(task);  // Lägg till den nya uppgiften i listan
      });
    }
  }

  toggleTaskCompletion(taskId: number, completed: boolean) {
    this.taskService.toggleTaskCompletion(taskId, !completed).subscribe(() => {
      const task = this.tasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;  // Uppdatera lokal status
      }
    });
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t.id !== taskId);  // Ta bort den raderade uppgiften från listan
    });
  }
}
