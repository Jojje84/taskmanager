import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  template: `
    <h1>Edit User</h1>
    <p>Editing user: {{ data.name }}</p>
    <button mat-button (click)="close()">Close</button>
  `,
  standalone: true,
  imports: [],
})
export class EditUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditUserComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}