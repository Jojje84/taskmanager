import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { Project } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://dummyjson.com/products'; // API URL för produkter

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<{ products: Project[] }>(this.apiUrl).pipe(
      map(response => response.products), // Extrahera arrayen av projects från response
      catchError(err => {
        console.error('Error fetching projects', err);
        return throwError(() => err);
      })
    );
  }
}
