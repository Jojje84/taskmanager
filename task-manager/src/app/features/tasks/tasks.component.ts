import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importera CommonModule här för att använda *ngFor
import { TaskService } from '../../core/services/task.service';  // Importera TaskService

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],  // Lägg till CommonModule här för att kunna använda *ngFor
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((response: any) => {
      console.log(response);  // Logga API-svaret för att kontrollera strukturen
      this.tasks = response.todos;  // Anpassa efter DummyJSON API:s svar
    });
  }

  addTask(title: string) {
    if (title.trim()) {
      const newTask = { 
        todo: title,        // Här använder vi 'todo' istället för 'title'
        completed: false,
        userId: 5           // Dummy userId (kan ändras efter behov)
      };
      this.taskService.addTask(newTask).subscribe((task: any) => {
        this.tasks.push(task);  // Lägg till den nya uppgiften i listan
      });
    }
  }

  toggleTaskCompletion(taskId: number, completed: boolean) {
    this.taskService.updateTask(taskId, { completed: !completed }).subscribe(() => {
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
