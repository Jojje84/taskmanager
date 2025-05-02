import { Component, Input, OnInit, signal, effect, computed, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private selectedUserIdSignal: WritableSignal<number | null> = signal(null);
  @Input() set selectedUserId(value: number) {
    this.selectedUserIdSignal.set(value);
  }

  total = signal(0);
  active = signal(0);
  completed = signal(0);
  low = signal(0);
  medium = signal(0);
  high = signal(0);

  progress = computed(() =>
    this.total() > 0 ? (this.completed() / this.total()) * 100 : 0
  );

  constructor(private taskService: TaskService) {
    effect(() => {
      const userId = this.selectedUserIdSignal();
      const allTasks = this.taskService.allTasks();

      if (!userId) return;

      const tasks = allTasks.filter(t => t.userId === userId);

      this.total.set(tasks.length);
      this.completed.set(tasks.filter(t => t.status === 'completed').length);
      this.low.set(tasks.filter(t => t.priority === 'Low' && t.status === 'active').length);
      this.medium.set(tasks.filter(t => t.priority === 'Medium' && t.status === 'active').length);
      this.high.set(tasks.filter(t => t.priority === 'High' && t.status === 'active').length);
    });
  }

  ngOnInit(): void {
    this.taskService.fetchTasks().subscribe();
  }
}
