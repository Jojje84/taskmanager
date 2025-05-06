import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  private selectedUserIdSignal: WritableSignal<number | null> = signal(null);

  @Input() set selectedUserId(value: number) {
    this.selectedUserIdSignal.set(value); // Uppdatera signalen med den nya userId
    this.updateSummary(); // Uppdatera sammanfattningen när selectedUserId ändras
  }

  total: WritableSignal<number> = signal(0);
  active: WritableSignal<number> = signal(0);
  completed: WritableSignal<number> = signal(0);
  low: WritableSignal<number> = signal(0);
  medium: WritableSignal<number> = signal(0);
  high: WritableSignal<number> = signal(0);
  progress: WritableSignal<number> = signal(0);

  constructor(private taskService: TaskService) {
    // Uppdatera sammanfattningen när komponenten initialiseras
    this.updateSummary();
  }

  // Funktion för att uppdatera sammanfattning baserat på vald användare
  private updateSummary(): void {
    const userId = this.selectedUserIdSignal(); // Hämta aktuell användare från signal

    // Hämta uppgifter från TaskService direkt via signalen
    const allTasks = this.taskService['tasks'](); // Hämta tasks från signalen i TaskService

    if (!userId) {
      // Om ingen användare är vald, sätt alla signaler till 0
      this.total.set(0);
      this.completed.set(0);
      this.low.set(0);
      this.medium.set(0);
      this.high.set(0);
      this.progress.set(0);
      return;
    }

    // Filtrera uppgifter baserat på användarens ID
    const tasks = allTasks.filter((t: Task) => t.userIds.includes(userId));

    // Uppdatera signaler med data från filtrerade uppgifter
    this.total.set(tasks.length);
    this.completed.set(tasks.filter((t: Task) => t.status === 'completed').length);
    this.low.set(tasks.filter((t: Task) => t.priority === 'Low' && t.status === 'active').length);
    this.medium.set(tasks.filter((t: Task) => t.priority === 'Medium' && t.status === 'active').length);
    this.high.set(tasks.filter((t: Task) => t.priority === 'High' && t.status === 'active').length);

    // Beräkna progress (procent)
    const progressValue = this.total() > 0 ? (this.completed() / this.total()) * 100 : 0;
    this.progress.set(progressValue);
  }
}
