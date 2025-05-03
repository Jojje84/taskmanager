import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { Observable, tap, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';

  // Signal för att hålla alla tasks
  private tasks = signal<Task[]>([]);
  
  // Computed signal för att filtrera tasks
  readonly allTasks = computed(() => this.tasks());

  // Notifiering vid task-ändring
  taskChanged$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Hämtar alla tasks från API och uppdaterar signalen
  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl).pipe(
      tap(data => this.tasks.set(data))
    );
  }

  // Hämtar alla tasks per användare och uppdaterar signalen
  getTasksByUserId(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?userId=${userId}`).pipe(
      tap(data => this.tasks.set(data))
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
        this.tasks.update(ts => [...ts, created]);
        this.taskChanged$.next(); // 🔔 notifiera om ändring
      })
    );
  }

  // Lägg till en task och uppdatera signalen
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(created => {
        this.tasks.update(ts => [...ts, created]);
        this.taskChanged$.next(); // 🔔 notifiera om ändring
      })
    );
  }

  // Ta bort en task och uppdatera signalen
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.tasks.update(ts => ts.filter(t => t.id !== id));
        this.taskChanged$.next(); // 🔔 notifiera om ändring
      })
    );
  }

  // Uppdatera en task och uppdatera signalen
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(
      tap(updated => {
        this.tasks.update(ts => ts.map(t => (t.id === id ? updated : t)));
        this.taskChanged$.next(); // 🔔 notifiera om ändring
      })
    );
  }
}
