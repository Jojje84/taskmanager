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

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent {
  @Input() userId!: number; // Tar emot userId från DashboardComponent
  @Input() projects: Project[] = []; // Lägg till detta
  @Output() projectSelected = new EventEmitter<number>(); // Skickar valt projekt tillbaka till DashboardComponent

  searchTerm: WritableSignal<string> = signal(''); // Använd signal för att skapa en skrivbar signal

  filteredProjects = computed(() => {
    const filtered = this.projects.filter((project) =>
      project.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
    console.log('Filtered projects:', filtered); // Debugging
    return filtered;
  });

  constructor(private projectService: ProjectService) {}

  ngOnChanges(): void {
    if (this.userId) {
      this.loadProjects(this.userId);
    }
  }

  loadProjects(userId: number): void {
    this.projectService.getProjectsByUserId(userId).subscribe((projects) => {
      console.log('Loaded projects:', projects); // Debugging
      this.projects = projects;
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term); // Uppdatera söktermen
  }

  onProjectClick(projectId: number): void {
    this.projectSelected.emit(projectId); // Skicka projektets ID till DashboardComponent
  }
}
