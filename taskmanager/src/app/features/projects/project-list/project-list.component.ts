import {
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'; // Importera ConfirmDialogComponent här
import { ProjectDetailComponent } from '../project-detail/project-detail.component'; // Importera ProjectDetailComponent här  


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatDialogModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent {
  @Input() userId!: number; // Tar emot userId från DashboardComponent
  @Input() projects: Project[] = []; // Lägg till detta
  @Output() projectSelected = new EventEmitter<number>(); // Skickar valt projekt tillbaka till DashboardComponent

  searchTerm: WritableSignal<string> = signal(''); // Använd signal för att skapa en skrivbar signal
  loading: boolean = false; // Lägg till denna rad
  filteredProjectsList: Project[] = []; // Lista för filtrerade projekt

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.projects; // Returnera alla projekt om söktermen är tom
    }
    return this.projects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term)
    );
  });

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    if (this.userId) {
      this.loadProjects(this.userId);
    }
  }

  loadProjects(userId: number): void {
  this.loading = true;
  this.projectService.fetchProjects().subscribe(
    (allProjects) => {
      this.projects = allProjects.filter(p =>
        Array.isArray(p.userIds) && p.userIds.includes(userId)
      );
      this.loading = false;
    },
    (error) => {
      console.error('Failed to load projects:', error);
      this.loading = false;
    }
  );
}


  onSearch(term: string): void {
    this.searchTerm.set(term); // Uppdatera söktermen
    this.filterProjects(); // Filtrera projekten
  }

  onProjectClick(projectId: number): void {
    this.projectSelected.emit(projectId); // Skicka projektets ID till DashboardComponent
  }

  openProjectFormDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      panelClass: 'newroject-dialog', // Lägg till en CSS-klass
      data: { userId: this.userId }, // Skicka valt användar-ID
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadProjects(this.userId);
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
          this.projectService.deleteProject(projectId).subscribe(() => {
            this.projects = this.projects.filter((p) => p.id !== projectId);
            console.log('Project deleted:', projectId);
          });
        }
      });
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      panelClass: 'editproject-detail-dialog', // Lägg till en CSS-klass
      data: { project }, // Skicka projektdata till dialogen
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Project detail dialog closed');
      this.loadProjects(this.userId); // Uppdatera projektlistan efter dialogen stängts
    });
  }

  filterProjects(): void {
    const query = this.searchTerm().toLowerCase(); // Hämta söktermen från signalen
    this.filteredProjectsList = this.projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
    );
  }
}
