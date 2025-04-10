import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // Importera HttpClientModule
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  // Importera AppRoutingModule här
import { TasksComponent } from './features/tasks/tasks.component';
import { TaskService } from './core/services/task.service';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,  // Lägg till TasksComponent här
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  // Lägg till AppRoutingModule här
    HttpClientModule,  // Lägg till HttpClientModule
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
