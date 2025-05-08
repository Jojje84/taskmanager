import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: number; projectId: number; task?: Task }
  ) {
    this.taskForm = this.fb.group({
      title: [data.task?.title || '', [Validators.required]],
      description: [data.task?.description || ''],
      priority: [data.task?.priority || 'Low', [Validators.required]],
      status: [data.task?.status || 'active', [Validators.required]],
      projectId: [data.projectId, [Validators.required]],
      creatorId: [data.userId, [Validators.required]], // Sätt creatorId från data
      deadline: [data.task?.deadline || ''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      if (this.data.task?.id) {
        // Uppdatera en befintlig uppgift
        const updatedTask = this.createOrderedTaskData({
          ...this.data.task,
          ...formValue,
        });

        this.taskService.updateTask(updatedTask.id, updatedTask); // Uppdatera uppgiften
        this.snackBar.open('Task updated successfully!', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(updatedTask); // Skicka tillbaka den uppdaterade uppgiften
      } else {
        // Skapa en ny uppgift
        const newTask = this.createOrderedTaskData({
          ...formValue,
          creatorId: this.data.userId,
        });

        this.taskService.createTask(newTask); // Skapa uppgiften
        this.snackBar.open('Task created successfully!', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(newTask); // Skicka tillbaka den skapade uppgiften
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Stänger dialogen utan att skicka något tillbaka
  }

  createOrderedTaskData(formValue: any): any {
    // Skapa objektet där id kommer först
    return {
      id: formValue.id || 0, // Placera 'id' först, låt backend generera om det inte finns
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      status: formValue.status,
      projectId: formValue.projectId,
      creatorId: formValue.creatorId,
      deadline: formValue.deadline,
    };
  }

  close(): void {
    this.dialogRef.close();
  }
}
