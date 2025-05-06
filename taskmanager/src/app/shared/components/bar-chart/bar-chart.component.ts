import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData, ChartOptions, Chart } from 'chart.js';
import { Subject } from 'rxjs';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: ` <canvas #chartCanvas></canvas> `,
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() selectedUserId!: number | undefined;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  private destroy$ = new Subject<void>();
  chart!: Chart<'bar'>;

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Active Tasks',
        data: [],
        backgroundColor: '#42a5f5',
      },
      {
        label: 'Completed Tasks',
        data: [],
        backgroundColor: '#66bb6a',
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'x',
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true, stacked: false },
    },
  };

  barChartType: ChartType = 'bar';

  constructor(private taskService: TaskService) {}

  ngOnChanges(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.chartCanvas.nativeElement;
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: this.barChartData,
      options: this.barChartOptions,
    });
  }

  // Fetch tasks for a given user
  fetchTasksForUser(): void {
    if (this.selectedUserId === undefined) return;

    // Använd signalen från TaskService för att läsa tasks
    const allTasks = this.taskService['tasks'](); // Anropa signalen via en metod
    const userTasks = allTasks.filter((task) =>
      task.userIds.includes(this.selectedUserId!)
    );
    this.updateChartWithTasks(userTasks);
  }

  // Update the chart with task data
  updateChartWithTasks(tasks: Task[]): void {
    const projectMap: { [projectId: string]: { active: number; completed: number } } = {};

    tasks.forEach((task) => {
      const key = task.projectId ? task.projectId.toString() : 'unknown';
      if (!projectMap[key]) {
        projectMap[key] = { active: 0, completed: 0 };
      }
      if (task.status === 'active') projectMap[key].active++;
      else if (task.status === 'completed') projectMap[key].completed++;
    });

    const labels = Object.keys(projectMap).map((id) => `Project ${id}`);
    const activeData = Object.values(projectMap).map((p) => p.active);
    const completedData = Object.values(projectMap).map((p) => p.completed);

    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = activeData;
    this.barChartData.datasets[1].data = completedData;

    this.chart.update();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
