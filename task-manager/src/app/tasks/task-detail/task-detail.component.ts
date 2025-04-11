import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  taskId!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Hämta uppgiftens ID från URL-parametern
    this.taskId = this.route.snapshot.paramMap.get('id')!;
  }

}
