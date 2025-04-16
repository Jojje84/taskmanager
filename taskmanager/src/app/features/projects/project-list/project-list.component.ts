import { Component, OnInit, Signal, signal, computed } from '@angular/core';
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
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  searchTerm = signal('');
  projects = signal<Project[]>([]);

  filteredProjects: Signal<Project[]> = computed(() =>
    this.projects().filter(p =>
      p.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      p.description?.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects.set(data);
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }
}
