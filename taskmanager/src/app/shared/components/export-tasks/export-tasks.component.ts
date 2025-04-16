import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Papa } from 'ngx-papaparse';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-export-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="exportToCSV()">📤 Exportera till CSV</button>
    <button (click)="exportToJSON()">🗃️ Exportera till JSON</button>
  `,
  styleUrls: ['./export-tasks.component.scss']
})
export class ExportTasksComponent {
  @Input() tasks: Task[] = [];

  constructor(private papa: Papa) {}

  exportToCSV(): void {
    const csv = this.papa.unparse(this.tasks.map(task => ({ ...task })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'tasks.csv');
    link.click();
  }

  exportToJSON(): void {
    const json = JSON.stringify(this.tasks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'tasks.json');
    link.click();
  }
}
