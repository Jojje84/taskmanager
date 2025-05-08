import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      avatar: [''],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const { id, ...newUserData } = this.userForm.value;
      this.userService.addUser(newUserData).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
