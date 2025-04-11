import { Component, OnInit } from '@angular/core';
import { TaskService } from '../core/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any[]) => {
      this.tasks = data.map((task: any) => ({
        ...task,
        important: !task.completed
      }));
    });
  }
}
