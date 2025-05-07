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
    effect(() => {
      const term = this.searchTerm().toLowerCase();
      const filtered = this.projects.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term)
      );
      this.filteredProjects.set(filtered);
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

    console.log('All projects from signal:', allProjects);

    // Filtrera projekten baserat på användarens ID
    const userProjects = allProjects.filter((project) => {
      if (!project.id) {
        console.error('Project ID is missing!', project);
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
        console.log('New project created or updated:', result);
        this.projects = [...this.projects, result];
        this.filteredProjects.set(this.projects);
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
          console.error('Project ID is missing!', updatedProject);
          return; // Avbryt om ID saknas
        }
        const index = this.projects.findIndex(
          (p) => p.id === updatedProject.id
        );
        if (index !== -1) {
          this.projects[index] = updatedProject;
          this.filteredProjects.set([...this.projects]);
        }
      }
    });
  }
}
