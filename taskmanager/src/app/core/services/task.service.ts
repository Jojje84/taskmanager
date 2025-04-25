import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks'; // Bas-URL för tasks

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTasksForProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?projectId=${projectId}`);
  }

  getTasksByUserId(userId: number): Observable<Task[]> {
    console.log('Fetching tasks for user ID:', userId); // Logga för felsökning
    return this.http.get<Task[]>(`${this.baseUrl}?userId=${userId}`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  addTask(task: Task): Observable<Task> {
    const newTask: Task = {
      id: 0, // Json-server auto-genererar ett nytt id
      title: task.title,
      status: task.status || 'active', // Standardstatus
      priority: task.priority || 'medium', // Standardprioritet
      projectId: task.projectId,
      userId: task.userId,
    };
    return this.http.post<Task>(this.baseUrl, newTask);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }
}
