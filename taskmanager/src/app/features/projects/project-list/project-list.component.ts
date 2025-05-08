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
  @Input() userId!: number;
  @Input() projects: Project[] = [];
  @Output() projectSelected = new EventEmitter<number>();

  searchTerm: WritableSignal<string> = signal('');
  loading: boolean = false;
  filteredProjects = signal<Project[]>([]);

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {
    // Effekt för att lyssna på förändringar i projektlistan
    effect(() => {
      const allProjects = this.projectService.getProjectsSignal();

      // Filtrera projekten baserat på användarens ID
      const userProjects = allProjects.filter((project) =>
        project.userIds?.includes(this.userId)
      );

      // Uppdatera komponentens projekt och filtrerade projekt
      this.projects = userProjects;
      this.filteredProjects.set(this.projects);
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnChanges(): void {
    if (this.userId) {
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.loading = true;

    // Hämta projekten från signalen i ProjectService
    const allProjects = this.projectService.getProjectsSignal();

    // Filtrera projekten baserat på användarens ID
    const userProjects = allProjects.filter((project) => {
      if (!project.id) {
        return false; // Ignorera projekt utan ID
      }
      return project.userIds?.includes(this.userId);
    });

    // Uppdatera komponentens projekt och filtrerade projekt
    this.projects = userProjects;
    this.filteredProjects.set(this.projects);

    this.loading = false;
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onProjectClick(projectId: number): void {
    this.projectSelected.emit(projectId);
  }

  openProjectFormDialog(project?: Project): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      panelClass: 'newproject-dialog',
      data: {
        userId: this.userId,
        project: project || { name: '', description: '', userIds: [] },
      },
    });

    dialogRef.afterClosed().subscribe((result: Project | false) => {
      if (result) {
        // Hantera resultatet om det behövs
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
          this.filteredProjects.set(this.projects);
        }
      });
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      panelClass: 'editproject-detail-dialog',
      data: { project },
    });

    dialogRef.afterClosed().subscribe((updatedProject) => {
      if (updatedProject) {
        if (!updatedProject.id) {
          return; // Avbryt om ID saknas
        }

        // Uppdatera projektet via ProjectService
        this.projectService.updateProject(updatedProject).subscribe(() => {
          // Uppdatera den lokala listan
          const index = this.projects.findIndex(
            (p) => p.id === updatedProject.id
          );
          if (index !== -1) {
            this.projects[index] = updatedProject;
            this.filteredProjects.set([...this.projects]);
          }
        });
      }
    });
  }
}
