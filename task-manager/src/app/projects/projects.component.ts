import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importera CommonModule
import { RouterModule } from '@angular/router'; // Importera RouterModule om du använder routerLink
import { ProjectService } from '../core/services/project.service'; // Din service
import { ReactiveFormsModule } from '@angular/forms'; // Importera ReactiveFormsModule om du använder formulär
import { ListCardComponent } from '../shared/components/list-card/list-card.component'; // Importera standalone-komponenten

@Component({
  selector: 'app-projects',
  standalone: true,  // Gör den standalone
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ListCardComponent],  // Importera de moduler som krävs
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];  // Gör projects till en array

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Hämta projekt från service
    this.projectService.getProjects().subscribe((data: any[]) => {
      this.projects = data;
    });
  }
}
