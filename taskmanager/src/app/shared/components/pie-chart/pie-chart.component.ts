import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts'; // För diagram och BaseChartDirective
import { ChartType } from 'chart.js'; // För korrekt typ på Chart
import { Task } from '../../../models/task.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../core/services/task.service'; // Importera TaskService

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedUserId!: number | undefined; // Ta emot användarens ID som input
  private subscription!: Subscription;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined; // Lägg till en referens till diagrammet

  pieChartData: any = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [0, 0, 0],
      },
    ],
  };

  pieChartType: ChartType = 'pie'; // Definiera korrekt ChartType för pie chart

  constructor(private taskService: TaskService) {}

  ngOnChanges(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
    }
  }

  ngOnInit(): void {
    if (this.selectedUserId) {
      this.fetchTasksForUser();
    }
  }

  fetchTasksForUser(): void {
    if (this.selectedUserId === undefined) {
      console.warn('No user selected for pie chart');
      return;
    }

    this.subscription?.unsubscribe(); // Avsluta tidigare prenumeration om det finns en
    this.subscription = this.taskService
      .getTasksByUserId(this.selectedUserId)
      .subscribe((tasks) => {
        console.log('Tasks for pie chart:', tasks);
        this.updateChart(tasks);
      });
  }

  updateChart(tasks: Task[]): void {
    const priorityCounts = { high: 0, medium: 0, low: 0 };

    // Filtrera endast uppgifter med status "active"
    const activeTasks = tasks.filter((task) => task.status === 'active');

    activeTasks.forEach((task) => {
      if (task.priority === 'High') {
        priorityCounts.high++;
      } else if (task.priority === 'Medium') {
        priorityCounts.medium++;
      } else if (task.priority === 'Low') {
        priorityCounts.low++;
      }
    });

    this.pieChartData.datasets[0].data = [
      priorityCounts.high,
      priorityCounts.medium,
      priorityCounts.low,
    ];

    if (this.chart) {
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // Rensa prenumerationen
  }
}
