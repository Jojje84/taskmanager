import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Signal, signal, computed } from '@angular/core'; // För att hantera signal och computed

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  @Input() userId!: number; // Lägg till Input för userId

  searchTerm = signal(''); // Använd signal för att hålla sökterm
  projects = signal<Project[]>([]); // Signal för projekt

  filteredProjects: Signal<Project[]> = computed(() =>
    this.projects().filter(
      (p) =>
        p.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        p.description?.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Hämta projekten baserat på userId istället för att hämta alla
    if (this.userId) {
      this.projectService.getProjectsByUserId(this.userId).subscribe((data) => {
        console.log('Projects:', data);
        this.projects.set(data); // Sätt projekten för den valda användaren
      });
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }
}
