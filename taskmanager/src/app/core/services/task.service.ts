import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';

  private tasks = signal<Task[]>([]);
  readonly allTasks = this.tasks;

  constructor(private http: HttpClient) {}

  // ✅ Kalla denna i ngOnInit i komponenter som vill ha signal
  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl).pipe(
      tap(data => this.tasks.set(data))
    );
  }

  // ✅ Fortsatt stöd för existerande kod
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTasksForProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?projectId=${projectId}`);
  }

  getTasksByUserId(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?userId=${userId}`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  // ✅ Ny computed signal
  getTasksSignalByUserId(userId: number) {
    return computed(() => this.tasks().filter(t => t.userId === userId));
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  addTask(task: Task): Observable<Task> {
    const newTask: Task = {
      id: 0,
      title: task.title,
      status: task.status || 'active',
      priority: task.priority || 'medium',
      projectId: task.projectId,
      userId: task.userId,
    };
    return this.http.post<Task>(this.baseUrl, newTask).pipe(
      tap(created => {
        this.tasks.update(ts => [...ts, created]);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.tasks.update(ts => ts.filter(t => t.id !== id));
      })
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(
      tap(updated => {
        this.tasks.update(ts =>
          ts.map(t => (t.id === id ? updated : t))
        );
      })
    );
  }
}
