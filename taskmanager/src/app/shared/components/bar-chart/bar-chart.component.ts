import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <canvas baseChart
      [data]="barChartData"
      [type]="barChartType"
      [options]="barChartOptions">
    </canvas>
  `,
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @Input() projectStats: { name: string; taskCount: number }[] = [];

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Tasks per project',
        data: [],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336', '#ff9800']
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'x'
  };

  barChartType: 'bar' = 'bar';

  ngOnChanges(): void {
    this.barChartData.labels = this.projectStats.map(p => p.name);
    this.barChartData.datasets[0].data = this.projectStats.map(p => p.taskCount);
  }
}
