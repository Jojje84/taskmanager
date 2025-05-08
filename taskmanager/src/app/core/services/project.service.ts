import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = 'http://localhost:3000/projects';

  // Signal för att hålla alla projekt
  private projects: WritableSignal<Project[]> = signal([]);

  constructor(private http: HttpClient) {}

  // Hämtar alla projekt från API och uppdaterar signalen
  fetchProjects(): void {
    this.http.get<Project[]>(this.baseUrl).subscribe((data) => {
      this.projects.set(data); // Uppdaterar signalen med de hämtade projekten
    });
  }

  // ✅ Fortsatt stöd för äldre komponenter
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  // Hämtar projekt för en specifik användare och uppdaterar signalen
  getProjectsByUserId(userId: number): void {
    this.http
      .get<Project[]>(`${this.baseUrl}?userId=${userId}`)
      .subscribe((data) => {
        const filtered = data.filter((p) => p.userIds?.includes(userId));
        this.projects.set(filtered); // Uppdatera signalen med filtrerade projekt
      });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  // Skapa ett nytt projekt och uppdatera signalen
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project).pipe(
      tap((createdProject) => {
        const existingProjects = this.projects();
        this.projects.set([...existingProjects, createdProject]);
      })
    );
  }

  // Lägg till ett projekt och uppdatera signalen
  addProject(project: Project): void {
    const newProject: Project = {
      id: 0, // Låt backend generera id om det inte sätts här
      name: project.name,
      description: project.description,
      creatorId: project.creatorId,
      userIds: project.userIds,
    };

    this.http
      .post<Project>(this.baseUrl, newProject)
      .subscribe((created: Project) => {
        const existingProjects = this.projects();
        if (!existingProjects.some((p) => p.id === created.id)) {
          this.projects.set([...existingProjects, created]);
        }
      });
  }

  // Ta bort ett projekt och uppdatera signalen
  deleteProject(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe(() => {
      const updatedProjects = this.projects().filter((p) => p.id !== id);
      this.projects.set(updatedProjects);
    });
  }

  // Uppdatera ett projekt och uppdatera signalen
  updateProject(project: Project): Observable<Project> {
    return this.http
      .put<Project>(`${this.baseUrl}/${project.id}`, project)
      .pipe(
        tap((updatedProject) => {
          if (!updatedProject.id) {
            return;
          }
          const index = this.projects().findIndex(
            (p) => p.id === updatedProject.id
          );
          if (index !== -1) {
            const updatedProjects = [...this.projects()];
            updatedProjects[index] = updatedProject;
            this.projects.set(updatedProjects);
          }
        })
      );
  }

  // Exponera signalens värde
  getProjectsSignal(): Project[] {
    return this.projects();
  }
}
