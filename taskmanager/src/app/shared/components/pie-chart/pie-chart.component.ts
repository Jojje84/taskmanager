import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <canvas baseChart
      [data]="pieChartData"
      [type]="pieChartType">
    </canvas>
  `,
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {
  @Input() totalTasks: number = 0;
  @Input() completedTasks: number = 0;
  @Input() overdueTasks: number = 0;

  pieChartData: ChartData<'pie'> = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [{ data: [0, 0, 0] }]
  };

  pieChartType: ChartType = 'pie';

  ngOnChanges(): void {
    const completed = this.completedTasks;
    const overdue = this.overdueTasks;
    const pending = Math.max(0, this.totalTasks - completed - overdue);

    this.pieChartData.datasets[0].data = [completed, pending, overdue];
  }
}
