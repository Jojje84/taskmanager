import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service'; // Projektservice används
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];  // Behåll projektnamn, även om API är produkter

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.getProjects().subscribe((res: any) => {
      this.projects = res.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description, // Om description finns
      }));
    });
  }
}
