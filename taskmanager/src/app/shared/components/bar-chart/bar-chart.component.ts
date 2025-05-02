import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData, ChartOptions, Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../core/services/task.service'; // Importera TaskService
import { Task } from '../../../models/task.model'; // Importera Task-modellen

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: ` <canvas #chartCanvas></canvas> `,
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @Input() selectedUserId!: number | undefined; // Ta emot användarens ID som input
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  private subscription!: Subscription;

  constructor(private taskService: TaskService) {}

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Tasks per project',
        data: [],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336', '#ff9800'],
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'x',
  };

  barChartType: 'bar' = 'bar';
  chart!: Chart;

  ngOnChanges(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.chartCanvas.nativeElement;
    this.chart = new Chart(canvas, {
      type: this.barChartType,
      data: this.barChartData,
      options: this.barChartOptions,
    });
  }

  ngOnInit(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
    }
  }

  fetchTasksForUser(): void {
    if (this.selectedUserId === undefined) {
      console.warn('No user selected for bar chart');
      return;
    }

    this.subscription?.unsubscribe(); // Avsluta tidigare prenumeration om det finns en
    this.subscription = this.taskService
      .getTasksByUserId(this.selectedUserId)
      .subscribe((tasks) => {
        console.log('Tasks for bar chart:', tasks);
        this.updateChartWithTasks(tasks);
      });
  }

  updateChartWithTasks(tasks: Task[]): void {
    const projectStatsMap: { [key: string]: number } = {};

    // Filtrera endast uppgifter med status "active"
    const activeTasks = tasks.filter((task) => task.status === 'active');

    activeTasks.forEach((task) => {
      if (projectStatsMap[task.projectId]) {
        projectStatsMap[task.projectId]++;
      } else {
        projectStatsMap[task.projectId] = 1;
      }
    });

    const projectStats = Object.keys(projectStatsMap).map((projectId) => ({
      name: `Project ${projectId}`,
      taskCount: projectStatsMap[projectId],
    }));

    this.chart.data.labels = projectStats.map((p) => p.name);
    this.chart.data.datasets[0].data = projectStats.map((p) => p.taskCount);

    if (this.chart) {
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.update(); // Uppdaterar diagrammet
    }
  }
}
