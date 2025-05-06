import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';

  // Signal för att hålla alla tasks
  private tasks: WritableSignal<Task[]> = signal([]); // Använd signal istället för BehaviorSubject

  constructor(private http: HttpClient) {}

  // Hämtar alla tasks från API och uppdaterar signalen
  fetchTasks() {
    this.http.get<Task[]>(this.baseUrl).subscribe((data) => {
      console.log('Fetched tasks:', data); // Logga hela datan från API
      this.tasks.set(data); // Uppdaterar signalen
      console.log('Updated tasks signal:', this.tasks()); // Logga den uppdaterade signalen
  
      // Logga varje task individuellt för att inspektera strukturen
      data.forEach(task => {
        console.log('Task details:', task);
      });
    });
  }

  // Hämtar alla tasks per användare och uppdaterar signalen
  getTasksByUserId(userId: number) {
    this.http.get<Task[]>(this.baseUrl).subscribe((data) => {
      const filtered = data.filter((t) => t.userIds?.includes(userId));
      this.tasks.set(filtered); // Uppdatera signalen med filtrerade tasks
    });
  }

  // Hämtar tasks för ett specifikt projekt
  getTasksForProject(projectId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}?projectId=${projectId}`);
  }

  // Skapa en ny task och uppdatera signalen
  createTask(task: Task) {
    this.http.post<Task>(this.baseUrl, task).subscribe((created: Task) => {
      this.tasks.set([...this.tasks(), created]); // Lägg till task i signalen
    });
  }

  // Lägg till en task och uppdatera signalen
  addTask(task: Task) {
    const newTask: Task = {
      id: 0, // Låt backend generera id om det inte sätts här
      title: task.title,
      priority: task.priority,
      status: task.status,
      projectId: task.projectId,
      userIds: task.userIds,
      deadline: task.deadline,
      projectName: task.projectName,
    };

    this.http.post<Task>(this.baseUrl, newTask).subscribe((created: Task) => {
      this.tasks.set([...this.tasks(), created]); // Lägg till task i signalen
    });
  }

  // Ta bort en task och uppdatera signalen
  deleteTask(id: number) {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.tasks.set(this.tasks().filter((t) => t.id !== id)); // Ta bort task från signalen
    });
  }

  // Uppdatera en task och uppdatera signalen
  updateTask(id: number, task: Task) {
    this.http.put<Task>(`${this.baseUrl}/${id}`, task).subscribe((updated: Task) => {
      this.tasks.set(this.tasks().map((t) => (t.id === id ? updated : t))); // Uppdatera task i signalen
    });
  }
}
