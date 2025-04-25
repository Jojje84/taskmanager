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

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() userId!: number; // Tar emot userId från DashboardComponent
  @Input() tasks: Task[] = []; // Lista över uppgifter
  @Output() taskSelected = new EventEmitter<number>(); // Skickar valt task-ID tillbaka till DashboardComponent

  searchTerm: WritableSignal<string> = signal(''); // Signal för söktermen
  loading: boolean = false; // Indikator för laddning
  filteredTasksList: Task[] = []; // Lista för filtrerade uppgifter

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.tasks; // Returnera alla uppgifter om söktermen är tom
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
    this.loading = true; // Starta loader
    this.taskService.getTasksByUserId(userId).subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.loading = false; // Stoppa loader
      },
      (error) => {
        console.error('Failed to load tasks:', error);
        this.loading = false; // Stoppa loader även vid fel
      }
    );
  }

  onSearch(term: string): void {
    this.searchTerm.set(term); // Uppdatera söktermen
    this.filterTasks(); // Filtrera uppgifterna
  }

  openTaskFormDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '80vw',
      height: '80vh',
      data: { userId: this.userId, task: task || null }, // Skicka userId och eventuell uppgift
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadTasks(this.userId); // Ladda om uppgifterna efter dialogen stängs
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
          this.taskService.deleteTask(taskId).subscribe(() => {
            this.tasks = this.tasks.filter((t) => t.id !== taskId);
            console.log('Task deleted:', taskId);
          });
        }
      });
  }

  filterTasks(): void {
    const query = this.searchTerm().toLowerCase(); // Hämta söktermen från signalen
    this.filteredTasksList = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query) 
    );
  }
}
