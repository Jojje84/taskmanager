import { Component, OnInit, Signal, signal, computed } from '@angular/core';
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
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  selectedStatus = signal<'all' | 'active' | 'completed'>('all');
  sortBy = signal<'title' | 'priority'>('title');

  filteredTasks: Signal<Task[]> = computed(() => {
    if (this.selectedStatus() === 'all') return this.tasks();
    return this.tasks().filter(t => t.status === this.selectedStatus());
  });

  sortedAndFilteredTasks: Signal<Task[]> = computed(() => {
    let list = [...this.filteredTasks()];

    if (this.sortBy() === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy() === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      list.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return list;
  });

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks.set(data);
    });
  }

  setStatusFilter(status: 'all' | 'active' | 'completed') {
    this.selectedStatus.set(status);
  }

  deleteTask(id: number): void {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.tasks.set(this.tasks().filter(t => t.id !== id));
        });
      }
    });
  }
}
