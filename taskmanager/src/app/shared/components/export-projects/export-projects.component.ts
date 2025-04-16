import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-export-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="exportToCSV()">📁 Exportera till CSV</button>
    <button (click)="exportToJSON()">🗃️ Exportera till JSON</button>
  `
})
export class ExportProjectsComponent {
  @Input() projects: Project[] = [];

  constructor(private papa: Papa) {}

  exportToCSV(): void {
    const csv = this.papa.unparse(this.projects.map(p => ({ ...p })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'projects.csv');
    link.click();
  }

  exportToJSON(): void {
    const json = JSON.stringify(this.projects, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'projects.json');
    link.click();
  }
}
