import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true, // Gör den standalone
  imports: [CommonModule, ReactiveFormsModule], // Lägg till ReactiveFormsModule här
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  form = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  onSubmit() {
    console.log(this.form.value);
  }
}