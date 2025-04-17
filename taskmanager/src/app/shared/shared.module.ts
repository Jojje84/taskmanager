import { NgModule } from '@angular/core';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { SummaryComponent } from './components/summary/summary.component';


@NgModule({
  declarations: [PieChartComponent, BarChartComponent, SummaryComponent],
  exports: [PieChartComponent, BarChartComponent, SummaryComponent],
})
export class SharedModule {}
