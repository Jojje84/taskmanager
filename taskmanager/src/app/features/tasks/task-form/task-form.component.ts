import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  projectId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      status: ['active', Validators.required],
      priority: ['medium', Validators.required],
      projectId: [null]
    });
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.form.patchValue({ projectId: this.projectId });
  }

  onSubmit() {
    if (this.form.valid) {
      this.taskService.createTask(this.form.value).subscribe(() => {
        this.router.navigate(['/tasks'], {
          queryParams: { projectId: this.projectId }
        });
      });
    }
  }
}
