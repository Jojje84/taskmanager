import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  taskForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    private dialogRef: MatDialogRef<TaskDetailComponent>, // Lägg till MatDialogRef
    private taskService: TaskService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.task = this.data.task;

    this.taskForm = this.fb.group({
      title: [this.task?.title, [Validators.required]],
      description: [this.task?.description],
      priority: [this.task?.priority, [Validators.required]],
      status: [this.task?.status, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.task) {
      const updatedTask = { ...this.task, ...this.taskForm.value };
      this.taskService.updateTask(this.task.id, updatedTask); // Anropa updateTask utan subscribe
      console.log('Task updated successfully!', updatedTask);
      this.dialogRef.close(updatedTask); // Stäng dialogen och returnera uppdaterad uppgift
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Stäng dialogen utan att returnera data
  }
}
