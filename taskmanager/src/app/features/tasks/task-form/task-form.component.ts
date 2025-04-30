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

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, // För grundläggande Angular-direktiv som *ngIf och *ngFor
    ReactiveFormsModule, // För att använda reaktiva formulär
    MatDialogModule, // För att använda Angular Material-dialoger
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: number; projectId: number }
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required], // Titel är obligatorisk
      priority: ['medium', Validators.required], // Prioritet är obligatorisk
      projectId: [
        this.data.projectId,
        [Validators.required, Validators.min(1)],
      ], // Projekt-ID är obligatoriskt
      userId: [this.data.userId, [Validators.required, Validators.min(1)]], // Användar-ID är obligatoriskt
    });
  }

  ngOnInit(): void {
    console.log('Dialog data:', this.data); // Kontrollera att userId, projectId och task är korrekta
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        status: 'active', // Sätt status till "active"
      };

      this.taskService.addTask(taskData).subscribe((createdTask) => {
        this.dialogRef.close(createdTask); // Skicka tillbaka den skapade uppgiften
      });
    } else {
      console.log('Form is invalid:', this.taskForm.errors); // Logga eventuella fel
      console.log('Form values:', this.taskForm.value); // Logga formulärets värden
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Stäng dialogen utan att skapa uppgiften
  }
}
