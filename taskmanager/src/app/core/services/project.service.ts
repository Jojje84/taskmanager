import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model'; // Adjust the import path as necessary
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model'; // Add the import for Task model

@Injectable({
  providedIn: 'root', // Gör denna service tillgänglig globalt
})
export class ProjectService {
  private baseUrl = 'http://localhost:3000/projects'; // Uppdatera med din API-URL

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

  getProjectsByUserId(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}?userId=${userId}`);
  }
  addProject(project: Project): Observable<Project> {
    const newProject: Project = {
      id: 0, // Json-server auto-genererar ett nytt id
      name: project.name,
      description: project.description,
      userId: project.userId,
    };
    return this.http.post<Project>(this.baseUrl, newProject);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${project.id}`, project);
  }
  
}
