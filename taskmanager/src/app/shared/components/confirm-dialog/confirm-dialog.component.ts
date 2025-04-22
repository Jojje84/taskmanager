import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title?: string;
  content?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Bekräfta' }}</h2>
    <mat-dialog-content>{{
      data.content || 'Är du säker på att du vill radera denna task?'
    }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Avbryt</button>
      <button mat-button color="warn" (click)="confirm()">Radera</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
