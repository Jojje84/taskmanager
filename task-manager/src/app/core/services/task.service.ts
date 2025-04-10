import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importera HttpClient
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model'; // Importera Task-modellen
import { map } from 'rxjs/operators'; // Importera map-operatorn

@Injectable({
  providedIn: 'root', // Gör TaskService tillgänglig globalt
})
export class TaskService {
  private apiUrl = 'https://dummyjson.com/todos'; // API-url för todos

  constructor(private http: HttpClient) {}

  // Hämta alla todos
  getTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        console.log('API Response:', response); // Logga API:s svar
        if (response.todos) {
          response.todos = response.todos.filter((task: any) => !task.isDeleted);
        }
        return response;
      })
    );
  }

  // Lägg till en todo
  addTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, task); // Lägg till en ny todo via POST
  }

  // Uppdatera en tasks status (completed)
  updateTask(taskId: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${taskId}`, updatedData); // Uppdatera todo via PUT
  }

  // Ta bort en todo
  deleteTask(taskId: number): Observable<any> {
    console.log('Marking task as deleted with ID:', taskId);
    return this.http.delete<any>(`${this.apiUrl}/${taskId}`).pipe(
      map((deletedTask) => {
        // Simulera borttagning genom att sätta isDeleted på uppgiften
        deletedTask.isDeleted = true;

        return deletedTask;
      })
    );
  }
}