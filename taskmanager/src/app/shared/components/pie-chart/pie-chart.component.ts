import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { Task } from '../../../models/task.model';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedUserId!: number | undefined;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  pieChartData: any = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [0, 0, 0],
      },
    ],
  };

  pieChartType: ChartType = 'pie';
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
      this.listenForTaskChanges();
    }
  }

  ngOnChanges(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
    }
  }

  fetchTasksForUser(): void {
    if (this.selectedUserId === undefined) return;

    this.taskService
      .getTasksByUserId(this.selectedUserId)
      .subscribe((tasks) => this.updateChart(tasks));
  }

  listenForTaskChanges(): void {
    this.taskService.taskChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedUserId) {
          this.fetchTasksForUser();
        }
      });
  }

  updateChart(tasks: Task[]): void {
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    const activeTasks = tasks.filter((t) => t.status === 'active');

    activeTasks.forEach((task) => {
      if (task.priority === 'High') priorityCounts.high++;
      else if (task.priority === 'Medium') priorityCounts.medium++;
      else if (task.priority === 'Low') priorityCounts.low++;
    });

    this.pieChartData.datasets[0].data = [
      priorityCounts.high,
      priorityCounts.medium,
      priorityCounts.low,
    ];

    this.chart?.update();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
