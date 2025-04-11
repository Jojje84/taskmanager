import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true // 👈 krävs för att använda i standalone/import-baserade moduler
})
export class StatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? '✅ Klar' : '⏳ Pågår';
  }
}
