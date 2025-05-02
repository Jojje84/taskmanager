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
export class TaskListComponent {
  @Input() userId!: number;
  @Input() tasks: Task[] = [];
  @Output() taskSelected = new EventEmitter<number>();
  @Input() projectId!: number;

  searchTerm: WritableSignal<string> = signal('');
  loading: boolean = false;
  filteredTasksList: Task[] = [];

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.tasks;
    }
    return this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.status.toLowerCase().includes(term) ||
        task.priority.toLowerCase().includes(term)
    );
  });

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnChanges(): void {
    if (this.userId) {
      this.loadTasks(this.userId);
    }
  }

  loadTasks(userId: number): void {
    this.loading = true;
    this.taskService.getTasksByUserId(userId).subscribe(
      (tasks) => {
        console.log('Tasks loaded:', tasks); // Kontrollera att nya uppgifter hämtas
        this.tasks = tasks;

        // Töm befintliga listor utan att byta referens
        this.lowPriorityTasks.length = 0;
        this.normalPriorityTasks.length = 0;
        this.highPriorityTasks.length = 0;
        this.completedTasks.length = 0;

        // Lägg till varje task i rätt kolumn
        for (const task of tasks) {
          if (task.status.toLowerCase() === 'completed') {
            this.completedTasks.push(task);
          } else {
            if (task.priority === 'Low') this.lowPriorityTasks.push(task);
            else if (task.priority === 'Normal') this.normalPriorityTasks.push(task);
            else if (task.priority === 'High') this.highPriorityTasks.push(task);
          }
        }

        this.loading = false;
      },
      (error) => {
        console.error('Failed to load tasks:', error);
        this.loading = false;
      }
    );
  }
  

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.filterTasks();
  }

  openTaskFormDialog(task?: Task): void {
    if (!this.userId || !this.projectId) {
      console.error('User ID or Project ID is missing');
      return;
    }

    const dialogRef = this.dialog.open(TaskFormComponent, {
      panelClass: 'newtask-dialog', 
      data: {
        userId: this.userId,
        projectId: this.projectId,
        task: task || null,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadTasks(this.userId);
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
          this.taskService.deleteTask(taskId).subscribe(
            () => {
              // Uppdatera listan med uppgifter
              this.tasks = this.tasks.filter((t) => t.id !== taskId);

              // Logga att uppgiften har tagits bort
              console.log('Task deleted:', taskId);

              // Lägg till eventuell extra logik här
              this.lowPriorityTasks = this.lowPriorityTasks.filter((t) => t.id !== taskId);
              this.normalPriorityTasks = this.normalPriorityTasks.filter((t) => t.id !== taskId);
              this.highPriorityTasks = this.highPriorityTasks.filter((t) => t.id !== taskId);
              this.completedTasks = this.completedTasks.filter((t) => t.id !== taskId);
            },
            (error) => {
              // Hantera fel om borttagningen misslyckas
              console.error('Failed to delete task:', error);
            }
          );
        }
      });
  }

  filterTasks(): void {
    const query = this.searchTerm().toLowerCase();
    this.filteredTasksList = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
    );
  }

  filteredTasksByPriority(priority: string) {
    return this.filteredTasks().filter((task) => task.priority === priority);
  }

  lowPriorityTasks: Task[] = [];
  normalPriorityTasks: Task[] = [];
  highPriorityTasks: Task[] = [];
  completedTasks: Task[] = [];

  onTaskDrop(event: any): void {
    if (event.previousContainer === event.container) return;
  
    const task = event.previousContainer.data[event.previousIndex];
    const previousList = event.previousContainer.data;
    const targetList = event.container.data;
    const targetId = event.container.id;
  
    if (targetId === 'completed') {
      task.status = 'completed';
    } else {
      task.status = 'active';
      task.priority = this.getPriorityFromContainer(targetId);
    }
  
    previousList.splice(event.previousIndex, 1);
    targetList.splice(event.currentIndex, 0, task);
  
    this.updateTask(task);
  }

  getPriorityFromContainer(containerId: string): string {
    if (containerId === 'low') return 'Low';
    if (containerId === 'normal') return 'Normal';
    if (containerId === 'high') return 'High';
    return '';
  }

  updateTask(task: Task): void {
    this.taskService.updateTask(task.id, task).subscribe(() => {
      console.log('Task updated:', task);
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailComponent, {
      panelClass: 'edittask-detail-dialog', // CSS-klass för styling
      data: { task }, // Skicka uppgiftsdata till dialogen
    });

    dialogRef.afterClosed().subscribe((updatedTask: Task | undefined) => {
      if (updatedTask) {
        // Uppdatera den specifika uppgiften i listan
        const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;

          // Uppdatera rätt kolumn
          this.lowPriorityTasks = this.tasks.filter(
            (t) => t.priority === 'Low' && t.status === 'active'
          );
          this.normalPriorityTasks = this.tasks.filter(
            (t) => t.priority === 'Normal' && t.status === 'active'
          );
          this.highPriorityTasks = this.tasks.filter(
            (t) => t.priority === 'High' && t.status === 'active'
          );
          this.completedTasks = this.tasks.filter(
            (t) => t.status === 'completed'
          );
        }
      }
      console.log('Task detail dialog closed');
    });
  }
}


