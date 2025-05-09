import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { Subject } from 'rxjs';

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
    labels: ['Own', 'Shared'],
    datasets: [
      {
        label: 'Own',
        data: [0],
        backgroundColor: '#42a5f5',
      },
      {
        label: 'Shared',
        data: [0],
        backgroundColor: '#66bb6a',
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

  constructor(private projectService: ProjectService) {
    effect(() => {
      if (!this.selectedUserId) return;

      const allProjects = this.projectService['projects']();

      // Egna projekt: där användaren är creator OCH det INTE är delat
      const ownProjects = allProjects.filter(
        (p: Project) =>
          p.creatorId === this.selectedUserId && p.userIds.length === 1 // Bara skaparen är med
      );

      // Delade projekt: där användaren är med och det är fler än en användare
      const sharedProjects = allProjects.filter(
        (p: Project) =>
          p.userIds.includes(this.selectedUserId) && p.userIds.length > 1 // Delat projekt
      );

      if (this.chart) {
        this.chart.data.labels = ['Project'];
        this.chart.data.datasets[0].data = [ownProjects.length];
        this.chart.data.datasets[1].data = [sharedProjects.length];
        this.chart.update();
      }
    });
  }

  ngOnInit(): void {
    this.projectService.fetchProjects();
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
    if (!this.selectedUserId || !this.chart) return;

    this.projectService.fetchProjects();

    const allProjects = this.projectService['projects']();

  
    const ownProjects = allProjects.filter(
      (p: Project) =>
        p.creatorId === this.selectedUserId && p.userIds.length === 1 // Bara skaparen är med
    );

    // Delade projekt: där användaren är med och det är fler än en användare
    const sharedProjects = allProjects.filter(
      (p: Project) =>
        p.userIds.includes(this.selectedUserId) && p.userIds.length > 1 // Delat projekt
    );

    this.chart.data.labels = ['My'];
    this.chart.data.datasets[0].data = [ownProjects.length];
    this.chart.data.datasets[1].data = [sharedProjects.length];
    this.chart.update();
  }
}
