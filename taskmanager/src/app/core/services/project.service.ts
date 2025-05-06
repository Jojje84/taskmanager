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
  createProject(project: Project): void {
    this.http
      .post<Project>(this.baseUrl, project)
      .subscribe((created: Project) => {
        this.projects.set([...this.projects(), created]); // Lägg till projekt i signalen
      });
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
        this.projects.set([...this.projects(), created]); // Lägg till projekt i signalen
      });
  }

  // Ta bort ett projekt och uppdatera signalen
  deleteProject(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.projects.set(this.projects().filter((p) => p.id !== id)); // Ta bort projekt från signalen
    });
  }

  // Uppdatera ett projekt och uppdatera signalen
  updateProject(project: Project): void {
    this.http
      .put<Project>(`${this.baseUrl}/${project.id}`, project)
      .subscribe((updated: Project) => {
        this.projects.set(
          this.projects().map((p) => (p.id === updated.id ? updated : p))
        ); // Uppdatera projekt i signalen
      });
  }

  // Exponera signalens värde
  getProjectsSignal(): Project[] {
    return this.projects();
  }
}
