import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() totalTasks: number = 0;
  @Input() completedTasks: number = 0;
  @Input() overdueTasks: number = 0;

  get progress(): number {
    return this.totalTasks > 0
      ? (this.completedTasks / this.totalTasks) * 100
      : 0;
  }
}
