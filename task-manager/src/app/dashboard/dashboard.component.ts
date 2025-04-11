import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../tasks/task-list/task-list.component'; // Importera TaskListComponent
import { ProjectListComponent } from '../projects/project-list/project-list.component'; // Importera ProjectListComponent

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, TaskListComponent,ProjectListComponent ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Hämta data eller utför andra initialiseringsåtgärder vid behov
  }

}
