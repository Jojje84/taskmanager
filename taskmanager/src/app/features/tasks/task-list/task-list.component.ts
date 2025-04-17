import {
  Component,
  OnInit,
  OnChanges,
  Signal,
  signal,
  computed,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { ExportTasksComponent } from '../../../shared/components/export-tasks/export-tasks.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ExportTasksComponent, MatDialogModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() tasks: Task[] = []; // Tar emot uppgifter från DashboardComponent
  selectedStatus = signal<'all' | 'active' | 'completed'>('all');
  sortBy = signal<'title' | 'priority'>('title');

  // Lägg till korrekt typ för priorityOrder
  priorityOrder: { [key: string]: number } = { high: 1, medium: 2, low: 3 };

  filteredTasks: Signal<Task[]> = computed(() => {
    if (this.selectedStatus() === 'all') return this.tasks;
    return this.tasks.filter((t: Task) => t.status === this.selectedStatus());
  });

  sortedAndFilteredTasks: Signal<Task[]> = computed(() => {
    let list = [...this.filteredTasks()];

    if (this.sortBy() === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy() === 'priority') {
      list.sort(
        (a, b) =>
          this.priorityOrder[a.priority] - this.priorityOrder[b.priority]
      );
    }

    return list;
  });

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Ta bort detta om tasks skickas som en @Input
    // this.taskService.getTasks().subscribe((data) => {
    //   this.tasks = data;
    // });
  }

  ngOnChanges(): void {
    console.log('Tasks:', this.tasks);
  }

  setStatusFilter(status: 'all' | 'active' | 'completed') {
    this.selectedStatus.set(status);
  }

  deleteTask(id: number): void {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.taskService.deleteTask(id).subscribe(() => {
            this.tasks = this.tasks.filter((t) => t.id !== id);
          });
        }
      });
  }
}
