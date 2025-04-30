import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = 'http://localhost:3000/projects';

  private projects = signal<Project[]>([]);
  readonly allProjects = this.projects;

  constructor(private http: HttpClient) {}

  // ✅ Reaktiv fetch
  fetchProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl).pipe(
      tap(data => this.projects.set(data))
    );
  }

  // ✅ Fortsatt stöd för äldre komponenter
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  getProjectsByUserId(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}?userId=${userId}`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  addProject(project: Project): Observable<Project> {
    const newProject: Project = {
      id: 0,
      name: project.name,
      description: project.description,
      userId: project.userId,
    };
    return this.http.post<Project>(this.baseUrl, newProject).pipe(
      tap(created => {
        this.projects.update(ps => [...ps, created]);
      })
    );
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${project.id}`, project).pipe(
      tap(updated => {
        this.projects.update(ps =>
          ps.map(p => (p.id === updated.id ? updated : p))
        );
      })
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.projects.update(ps => ps.filter(p => p.id !== id));
      })
    );
  }
}
