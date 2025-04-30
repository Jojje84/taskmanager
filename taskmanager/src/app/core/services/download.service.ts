import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  downloadAsExcel(data: any) {
    const workbook = new ExcelJS.Workbook();

    // Skapa ett ark för Tasks
    const taskSheet = workbook.addWorksheet('Tasks');
    taskSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Project ID', key: 'projectId', width: 15 },
      { header: 'User ID', key: 'userId', width: 15 },
    ];
    taskSheet.addRows(data.tasks);

    // Skapa ett ark för Projects
    const projectSheet = workbook.addWorksheet('Projects');
    projectSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'User ID', key: 'userId', width: 15 },
    ];
    projectSheet.addRows(data.projects);

    // Spara arbetsboken som en Excel-fil
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'data.xlsx';
      link.click();
    });
  }

  downloadAsCSV(data: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Project ID', key: 'projectId', width: 15 },
      { header: 'User ID', key: 'userId', width: 15 },
    ];
    worksheet.addRows(data.tasks);

    workbook.csv.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'data.csv';
      link.click();
    });
  }

  downloadAsJSON(data: any) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
