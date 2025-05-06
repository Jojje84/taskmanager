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
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.projectForm = this.fb.group({
      name: [''], // Namn är inte längre obligatoriskt
      description: [''], // Beskrivning är inte längre obligatorisk
      creatorId: [this.data.userId], // CreatorId är inte längre obligatoriskt
      userIds: [[]], // UserIds är inte längre obligatoriskt
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  onSubmit(): void {
    console.log('onSubmit called'); // Kontrollera om metoden körs

    const formValue = this.projectForm.value;

    // ✅ Lägg till creatorId i userIds (om den inte redan finns)
    if (!formValue.userIds.includes(formValue.creatorId)) {
      formValue.userIds.push(formValue.creatorId);
    }

    this.projectService.addProject(formValue); // Uppdaterar signalen i ProjectService
    console.log('Project created successfully');
    this.dialogRef.close('refresh');
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
