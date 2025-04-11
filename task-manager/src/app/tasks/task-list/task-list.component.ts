import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((res: any) => {
      const tasks = res.todos;
      this.todoTasks = tasks.filter((t: any) => !t.completed && t.id % 3 !== 0);
      this.inProgressTasks = tasks.filter((t: any) => !t.completed && t.id % 3 === 0);
      this.doneTasks = tasks.filter((t: any) => t.completed);
    });
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      return;
    }
    const prevList = event.previousContainer.data;
    const currList = event.container.data;
    const task = prevList[event.previousIndex];
    prevList.splice(event.previousIndex, 1);
    currList.splice(event.currentIndex, 0, task);
  }
}
