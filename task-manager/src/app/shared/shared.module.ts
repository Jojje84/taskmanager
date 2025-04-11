import { NgModule } from '@angular/core';

import { ListCardComponent } from './components/list-card/list-card.component';
import { StatusPipe } from './pipes/status.pipe';

@NgModule({
  imports: [
    ListCardComponent,
    StatusPipe
  ],
  exports: [
    ListCardComponent,
    StatusPipe
  ]
})
export class SharedModule {}
