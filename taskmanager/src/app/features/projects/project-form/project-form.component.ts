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
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; project?: Project }
  ) {
    this.projectForm = this.fb.group({
      name: [data.project?.name || ''],
      description: [data.project?.description || ''],
      creatorId: [data.userId],
      userIds: [data.project?.userIds || []],
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      // Filtrera bort skaparen från användarlistan
      this.users = users.filter((user) => user.id !== this.data.userId);
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      if (this.data.project?.id) {
        // Uppdatera ett befintligt projekt
        const updatedProject = this.createOrderedProjectData({
          ...this.data.project,
          ...formValue,
        });

        this.projectService.updateProject(updatedProject).subscribe(() => {
          this.snackBar.open('Project updated successfully!', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(updatedProject); // Skicka tillbaka det uppdaterade projektet
        });
      } else {
        // Skapa ett nytt projekt
        const newProject = this.createOrderedProjectData({
          ...formValue,
          creatorId: this.data.userId,
          userIds: [...(formValue.userIds || []), this.data.userId], // Lägg till creatorId i userIds
        });

        this.projectService
          .createProject(newProject)
          .subscribe((createdProject) => {
            this.snackBar.open('Project created successfully!', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(createdProject); // Skicka tillbaka det skapade projektet
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Stänger dialogen utan att skicka något tillbaka
  }

  createOrderedProjectData(formValue: any): any {
    // Skapa objektet där id kommer först
    return {
      id: formValue.id || 0, // Placera 'id' först, låt backend generera om det inte finns
      name: formValue.name,
      description: formValue.description,
      creatorId: formValue.creatorId,
      userIds: formValue.userIds,
    };
  }
}
