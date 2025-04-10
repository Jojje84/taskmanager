import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importera HttpClient
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';  // Importera Task-modellen

@Injectable({
  providedIn: 'root'  // Gör TaskService tillgänglig överallt i appen
})
export class TaskService {
  private apiUrl = 'https://dummyjson.com/todos';  // Din API URL här

  constructor(private http: HttpClient) {}  // Injicera HttpClient

  // Hämta alla uppgifter
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);  // Hämta alla todos
  }

  // Lägg till en uppgift
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);  // Lägg till en ny task
  }

  // Uppdatera en uppgifts status
  toggleTaskCompletion(taskId: number, completed: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, { completed });
  }

  // Ta bort en uppgift
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}
