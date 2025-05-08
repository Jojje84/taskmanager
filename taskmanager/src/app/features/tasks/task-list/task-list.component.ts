import {
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  effect,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskDetailComponent } from '../task-detail/task-detail.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DragDropModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @Input() userId!: number; // Behåll om det används någon annanstans
  @Input() projectId!: number;
  @Output() taskSelected = new EventEmitter<number>();

  tasks: WritableSignal<Task[]> = signal([]);
  searchTerm: WritableSignal<string> = signal('');

  localTasks: Task[] = [];
  filteredTasksList: Task[] = [];
  loading: boolean = false;

  lowPriorityTasks: Task[] = [];
  mediumPriorityTasks: Task[] = [];
  highPriorityTasks: Task[] = [];
  completedTasks: Task[] = [];

  constructor(private taskService: TaskService, private dialog: MatDialog) {
    // Effekt för att lyssna på förändringar i signalen
    effect(() => {
      const allTasks = this.taskService['tasks'](); // Hämta signalvärdet
      console.log('All tasks from signal:', allTasks);

      // Filtrera endast baserat på projectId
      const tasks = allTasks.filter((t) => t.projectId === this.projectId);

      this.localTasks = tasks;
      this.filteredTasksList = tasks;

      this.lowPriorityTasks = [];
      this.mediumPriorityTasks = [];
      this.highPriorityTasks = [];
      this.completedTasks = [];

      for (const task of tasks) {
        if (task.status.toLowerCase() === 'completed') {
          this.completedTasks.push(task);
        } else {
          if (task.priority === 'Low') this.lowPriorityTasks.push(task);
          else if (task.priority === 'Medium')
            this.mediumPriorityTasks.push(task);
          else if (task.priority === 'High') this.highPriorityTasks.push(task);
        }
      }
    });
  }

  ngOnInit(): void {
    this.taskService.fetchTasks(); // Hämta tasks från servern
  }

  ngOnChanges(): void {
    if (this.projectId) {
      console.log('ngOnChanges triggered with projectId:', this.projectId);
    }
  }

  openTaskFormDialog(task?: Task): void {
    if (!this.projectId) return;

    const dialogRef = this.dialog.open(TaskFormComponent, {
      panelClass: 'newtask-dialog',
      data: {
        userId: this.userId, // Behåll om det behövs i TaskFormComponent
        projectId: this.projectId,
        task: task || null,
      },
    });

    dialogRef.afterClosed().subscribe((result: Task | false) => {
      if (result) {
        console.log('Task form dialog closed with result:', result);
        this.taskService.fetchTasks(); // Hämta uppdaterade tasks från servern
      }
    });
  }

  deleteTask(taskId: number): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete Task',
          content: 'Are you sure you want to delete this task?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.taskService.deleteTask(taskId);
        }
      });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.filterTasks();
  }

  filterTasks(): void {
    const query = this.searchTerm().toLowerCase();
    this.filteredTasksList = this.localTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
    );
  }

  loadTasks(userId: number): void {
    this.loading = true;
    this.taskService.fetchTasks();

    const allTasks = this.taskService['tasks'](); // Hämta signalvärdet
    const tasks = allTasks.filter(
      (t) => t.creatorId === userId && t.projectId === this.projectId
    );

    this.tasks.set(tasks);
    this.localTasks = tasks;
    this.filteredTasksList = tasks;

    this.lowPriorityTasks = [];
    this.mediumPriorityTasks = [];
    this.highPriorityTasks = [];
    this.completedTasks = [];

    for (const task of tasks) {
      if (task.status.toLowerCase() === 'completed') {
        this.completedTasks.push(task);
      } else {
        if (task.priority === 'Low') this.lowPriorityTasks.push(task);
        else if (task.priority === 'Medium')
          this.mediumPriorityTasks.push(task);
        else if (task.priority === 'High') this.highPriorityTasks.push(task);
      }
    }

    this.loading = false;
  }

  editTask(task: Task): void {
    this.openTaskFormDialog(task);
  }

  filteredTasksByPriority(priority: string) {
    return this.filteredTasksList.filter((task) => task.priority === priority);
  }

  updateTask(task: Task): void {
    if (task.id !== undefined) {
      this.taskService.updateTask(task.id, task);
    }
    this.loadTasks(this.userId);
  }

  onTaskDrop(event: any): void {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const task = event.item.data;

    console.log('Task dropped:', task);
    console.log('Previous index:', previousIndex);
    console.log('Current index:', currentIndex);

    // Uppdatera taskens status eller prioritet baserat på droppositionen
    if (event.container.id === 'completed') {
      task.status = 'completed';
    } else if (event.container.id === 'low') {
      task.priority = 'Low';
    } else if (event.container.id === 'medium') {
      task.priority = 'Medium';
    } else if (event.container.id === 'high') {
      task.priority = 'High';
    }

    // Uppdatera task i backend
    this.updateTask(task);
  }
}
