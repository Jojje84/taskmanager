import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  // Importera RouterModule och Routes
import { HomeComponent } from '../app/shared/components/home/home.component';  // Importera HomeComponent
import { DashboardComponent } from '../app/features/dashboard/dashboard.component';  // Importera DashboardComponent
import { TasksComponent } from '../app/features/tasks/tasks.component';  // Importera TasksComponent

// Importera routes-objektet
import { routes } from './app.routes';

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Här används routes-objektet som du definierade
  exports: [RouterModule]
})
export class AppRoutingModule { }
