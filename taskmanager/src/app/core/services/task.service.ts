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

  getTasksByProjectId(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tasks?projectId=${projectId}`);
  }

  getTasksByUserId(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?userId=${userId}`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl); // Hämtar alla uppgifter
  }

  getTasksForProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}?projectId=${projectId}`);
  }

  addTask(task: any): Observable<any> {
    return this.http.post('/api/tasks', task); // Mock-API URL
  }
}
