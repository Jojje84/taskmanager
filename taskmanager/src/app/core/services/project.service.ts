import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model'; // Adjust the import path as necessary
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model'; // Add the import for Task model

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = 'http://localhost:3000/projects';
  private tasksUrl = 'http://localhost:3000/tasks'; // Assuming tasks are in a separate endpoint

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getProjectsByUserId(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}?userId=${userId}`);
  }
}
