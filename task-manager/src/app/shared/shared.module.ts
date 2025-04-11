import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCardComponent } from './components/list-card/list-card.component';
import { StatusPipe } from './pipes/status.pipe';

@NgModule({
  declarations: [
    ListCardComponent,
    StatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ListCardComponent,
    StatusPipe
  ]
})
export class SharedModule { }
