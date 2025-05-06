import {
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'; 
import { ProjectDetailComponent } from '../project-detail/project-detail.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent {
  @Input() userId!: number; // Tar emot userId från DashboardComponent
  @Input() projects: Project[] = []; // Tar emot en vanlig array här
  @Output() projectSelected = new EventEmitter<number>(); // Skickar valt projekt tillbaka till DashboardComponent

  searchTerm: WritableSignal<string> = signal(''); // Använd signal för att skapa en skrivbar signal
  loading: boolean = false;

  // Använd computed signal för att filtrera projekt baserat på sökterm
  filteredProjects = signal<Project[]>([]);

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {
    // Lägg till effekt för att lyssna på förändringar i signalen
    effect(() => {
      const term = this.searchTerm().toLowerCase();
      const filtered = this.projects.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term)
      );
      this.filteredProjects.set(filtered);  // Uppdatera den filtrerade listan av projekt
    });
  }

  ngOnInit(): void {
    this.loadProjects(); // Hämta projekten från servern när komponenten laddas
  }

  ngOnChanges(): void {
    if (this.userId) {
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.fetchProjects(); // Hämtar projekten från API

    const allProjects = this.projectService['projects'](); // Hämta signalen

    // Filtrera projekten baserat på userId
    const userProjects = allProjects.filter(
      (project) => project.userIds?.includes(this.userId)
    );

    // Uppdatera projekten och sätt dem till signalen
    this.projects = userProjects;
    this.loading = false;

    // Uppdatera filteredProjects varje gång projekten ändras
    this.filteredProjects.set(this.projects);  // Viktigt att uppdatera filteredProjects
  }

  onSearch(term: string): void {
    this.searchTerm.set(term); // Uppdatera söktermen
  }

  onProjectClick(projectId: number): void {
    this.projectSelected.emit(projectId); // Skicka projektets ID till DashboardComponent
  }

  openProjectFormDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      panelClass: 'newproject-dialog',
      data: { userId: this.userId },
    });
  
    dialogRef.afterClosed().subscribe((result: Project | false) => {
      if (result) {
        console.log('New project created:', result);
        // Lägg till det nya projektet i signalen
        this.projects = [...this.projects, result]; // Lägg till det nya projektet direkt
        this.filteredProjects.set(this.projects); // Uppdatera den filtrerade listan också
      }
    });
  }
  

  deleteProject(projectId: number): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete Project',
          content: 'Are you sure you want to delete this project?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.projectService.deleteProject(projectId);
          this.projects = this.projects.filter((p) => p.id !== projectId);
          console.log('Project deleted:', projectId);
          this.filteredProjects.set(this.projects);  // Uppdatera filteredProjects efter borttagning
        }
      });
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      panelClass: 'editproject-detail-dialog',
      data: { project },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Project detail dialog closed');
      this.loadProjects(); // Uppdatera projektlistan efter dialogen stängts
    });
  }
}
