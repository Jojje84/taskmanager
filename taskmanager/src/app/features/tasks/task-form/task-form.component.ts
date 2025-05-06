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
      status: ['active', Validators.required], // Lägg till statusfält
      projectId: [
        this.data.projectId,
        [Validators.required, Validators.min(1)],
      ], // Projekt-ID är obligatoriskt
      userId: [this.data.userId, [Validators.required, Validators.min(1)]], // Användar-ID är obligatoriskt
      userIds: [[]], // Initialisera userIds som en tom array
    });
  }

  ngOnInit(): void {
    console.log('Dialog data:', this.data); // Kontrollera att userId, projectId och task är korrekta
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      if (!formValue.userIds.includes(this.data.userId)) {
        formValue.userIds.push(this.data.userId);
      }

      const taskData = this.createOrderedTaskData(formValue);

      this.taskService.addTask(taskData); // Lägg till uppgiften via signalen
      this.dialogRef.close(taskData); // Skicka tillbaka skapad uppgift
    } else {
      console.warn('Form is invalid. Please check the input fields.');
    }
  }

  createOrderedTaskData(formValue: any): any {
    // Skapa objektet där id kommer först
    return {
      id: formValue.id, // Placera 'id' först
      title: formValue.title,
      priority: formValue.priority,
      status: formValue.status,
      projectId: formValue.projectId,
      userId: formValue.userId,
      userIds: formValue.userIds,
    };
  }

  onCancel(): void {
    this.dialogRef.close(false); // Stäng dialogen utan att skapa uppgiften
  }

  filterUsers(users: any[], searchTerm: string): any[] {
    return users.filter((user) =>
      (user.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );
  }
}
