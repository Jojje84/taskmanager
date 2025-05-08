import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';
import { forkJoin, Observable } from 'rxjs';

interface DataSection {
  type: string;
  data: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  fetchTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tasks`);
  }

  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  fetchProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects`);
  }

  downloadAsJSON(data: DataSection[], filename: string) {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadAsCSV(data: DataSection[], filename: string) {
    let csvContent = '';

    data.forEach((section) => {
      csvContent += `${section.type}\n`;

      if (section.data.length > 0) {
        csvContent += Object.keys(section.data[0]).join(',') + '\n';
        csvContent += section.data
          .map((item: Record<string, any>) => Object.values(item).join(','))
          .join('\n') + '\n\n';
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
