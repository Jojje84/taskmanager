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
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true, // Gör komponenten standalone
  imports: [
    CommonModule, // För grundläggande Angular-direktiv som *ngIf och *ngFor
    ReactiveFormsModule, // För att använda reaktiva formulär
    MatDialogModule, // För att använda Angular Material-dialoger
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      userId: [this.data.userId, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.projectForm.valid) {
      const { id, ...newProjectData } = this.projectForm.value; // Exkludera `id`
      this.projectService.addProject(newProjectData).subscribe(() => {
        this.dialogRef.close('refresh'); // Stäng dialogen och meddela att projektet skapades
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Stäng dialogen utan att skapa projekt
  }
}
