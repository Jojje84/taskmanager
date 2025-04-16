import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  taskId?: number;
  projectId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));

    this.form = this.fb.group({
      title: ['', Validators.required],
      status: ['active', Validators.required],
      priority: ['medium', Validators.required],
      projectId: [this.projectId, Validators.required],
      deadline: ['']
    });

    if (this.taskId) {
      this.isEdit = true;
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        this.form.patchValue(task);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const task: Task = this.form.value as Task;

    if (this.isEdit && this.taskId) {
      this.taskService.updateTask(this.taskId, task).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(task).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}
