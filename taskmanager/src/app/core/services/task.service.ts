import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';

  // Signal för att hålla alla tasks
  private tasks = signal<Task[]>([]);
  
  // Computed signal för att filtrera tasks
  readonly allTasks = computed(() => this.tasks());

  constructor(private http: HttpClient) {}

  // Hämtar alla tasks från API och uppdaterar signalen
  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl).pipe(
      tap(data => this.tasks.set(data)) // Uppdatera tasks signal med nya data
    );
  }

  // Hämtar alla tasks per användare och uppdaterar signalen
  getTasksByUserId(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?userId=${userId}`).pipe(
      tap(data => this.tasks.set(data)) // Uppdatera tasks signal med användarens data
    );
  }

  // Hämtar tasks för ett specifikt projekt
  getTasksForProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?projectId=${projectId}`);
  }

  // Skapa en ny task och uppdatera signalen
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(created => {
        // Uppdatera tasks signal med den nya tasken
        this.tasks.update(ts => [...ts, created]);
      })
    );
  }

  // Lägg till en task och uppdatera signalen
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(created => {
        // Uppdatera tasks signal med den nya tasken
        this.tasks.update(ts => [...ts, created]);
      })
    );
  }

  // Ta bort en task och uppdatera signalen
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // Uppdatera tasks signal genom att ta bort tasken
        this.tasks.update(ts => ts.filter(t => t.id !== id));
      })
    );
  }

  // Uppdatera en task och uppdatera signalen
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(
      tap(updated => {
        // Uppdatera tasks signal genom att uppdatera den ändrade tasken
        this.tasks.update(ts => ts.map(t => (t.id === id ? updated : t)));
      })
    );
  }

  
}
