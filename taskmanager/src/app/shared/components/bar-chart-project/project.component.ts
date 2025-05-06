import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bar-chart-by-project',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `<canvas #chartCanvas></canvas>`,
})
export class BarChartByProjectComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() selectedUserId!: number;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart!: Chart<'bar'>;

  private destroy$ = new Subject<void>();

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Projects',
        data: [],
        backgroundColor: '#42a5f5',
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // ✅ fixat
        },
      },
    },
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnChanges(): void {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: this.chartData,
      options: this.chartOptions,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects(): void {
    if (!this.selectedUserId) return;

    this.projectService.fetchProjects(); // Uppdaterar signalen i ProjectService

    const allProjects = this.projectService['projects'](); // Använd signalen direkt
    const userProjects = allProjects.filter((p: Project) =>
      p.userIds.includes(this.selectedUserId)
    );

    this.chart.data.labels = userProjects.map((p) => p.name);
    this.chart.data.datasets[0].data = userProjects.map(() => 1);
    this.chart.update();
  }
}
