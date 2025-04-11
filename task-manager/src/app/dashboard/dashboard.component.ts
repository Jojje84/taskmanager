import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../tasks/task-list/task-list.component'; // Importera TaskListComponent
import { ProjectListComponent } from '../projects/project-list/project-list.component'; // Importera ProjectListComponent

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, TaskListComponent, ProjectListComponent]
})
export class DashboardComponent implements OnInit {

  // Data för varje kategori (To Do, In Progress, Done)
  todoTasks = [
    { todo: 'Do something nice for someone you care about' },
    { todo: 'Watch a documentary' }
  ];

  inProgressTasks = [
    { todo: 'Contribute to an open-source software project' },
    { todo: 'Go see a Broadway production' }
  ];

  doneTasks = [
    { todo: 'Memorize a poem' },
    { todo: 'Watch a classic movie' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Hämta data eller utför andra initialiseringsåtgärder vid behov
  }

  // Getter-metoder för att räkna antalet uppgifter i varje kategori
  get completedTasksCount() {
    return this.doneTasks.length;
  }

  get incompleteTasksCount() {
    return this.inProgressTasks.length;
  }

  get todoTasksCount() {
    return this.todoTasks.length;
  }

}
